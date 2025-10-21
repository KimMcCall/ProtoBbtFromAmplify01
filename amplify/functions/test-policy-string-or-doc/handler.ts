// import { secret } from "@aws-amplify/backend";
import type { Schema } from "../../data/resource"

import { docs_v1, google } from 'googleapis';
import { GoogleAuth, AuthClient } from 'google-auth-library';


// Types for Perspective API
interface PerspectiveAttribute {
  summaryScore: {
    value: number;
    type: string;
  };
  spanScores?: Array<{
    begin: number;
    end: number;
    score: {
      value: number;
      type: string;
    };
  }>;
}

interface PerspectiveResponse {
  attributeScores: {
    [key: string]: PerspectiveAttribute;
  };
  languages: string[];
  detectedLanguages?: string[];
}

interface ModerationResult {
  text: string;
  scores: {
    [key: string]: number;
  };
  flagged: boolean;
  flaggedCategories: string[];
}


class PerspectiveModeration {
  private apiKey: string;
  private threshold: number;

  constructor(apiKey: string, threshold: number = 0.7) {
    this.apiKey = apiKey;
    this.threshold = threshold;
  }

  /**
   * Analyze text using Perspective API
   */
  async analyzeText(text: string): Promise<string> {
    const url = `https://commentanalyzer.googleapis.com/v1alpha1/comments:analyze?key=${this.apiKey}`;

    const requestBody = {
      comment: { text },
      languages: ['en'],
      requestedAttributes: {
        TOXICITY: {},
        SEVERE_TOXICITY: {},
        IDENTITY_ATTACK: {},
        INSULT: {},
        PROFANITY: {},
        THREAT: {},
        SEXUALLY_EXPLICIT: {},
        FLIRTATION: {}
      }
    };

    try {
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestBody),
      });

      if (!response.ok) {
        throw new Error(`Perspective API error: ${response.status} ${response.statusText}`);
      }

      const data: PerspectiveResponse = await response.json();

      // Extract scores
      const scores: { [key: string]: number } = {};
      const flaggedCategories: string[] = [];

      for (const [attribute, result] of Object.entries(data.attributeScores)) {
        const score = result.summaryScore.value;
        scores[attribute] = score;

        if (score >= this.threshold) {
          flaggedCategories.push(attribute);
        }
      }

      const retValueObject: ModerationResult = {
        text,
        scores,
        flagged: flaggedCategories.length > 0,
        flaggedCategories,
      };
      const retValue = JSON.stringify(retValueObject);
      return retValue;
    } catch (error) {
      throw new Error(`Failed to analyze text: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  /**
   * Extract text from Google Doc and moderate it
   */
  async moderateGoogleDoc(docId: string, auth: GoogleAuth<AuthClient>): Promise<string> {
    const docs = google.docs({ version: 'v1', auth });

    try {
      // Fetch the document
      const doc = await docs.documents.get({ documentId: docId });

      // Extract text content
      const text = this.extractTextFromDoc(doc.data);

      // Analyze the text
      return await this.analyzeText(text);
    } catch (error) {
      throw new Error(`Failed to moderate Google Doc: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  /**
   * Extract plain text from Google Docs document structure
   */
  private extractTextFromDoc(doc: docs_v1.Schema$Document): string {
    let text = '';

    if (doc.body && doc.body.content) {
      for (const element of doc.body.content) {
        if (element.paragraph) {
          if (element.paragraph.elements) {
            for (const item of element.paragraph.elements) {
              if (item.textRun && item.textRun.content) {
                text += item.textRun.content;
              }
            }
          }
        }
      }
    }

    return text.trim();
  }
}




export const handler: Schema["testPolicyStringOrDoc"]["functionHandler"] = async (event) => {
  const { text, docUrl } = event.arguments;

  const env = process.env;

  const flagThreshold = 0.6;
  const apiKey = env.PERSPECTIVE_API_KEY || '';
  const moderator = new PerspectiveModeration(apiKey, flagThreshold);
  if (docUrl) {
    // Extract the document ID from the URL
    const docIdMatch = docUrl.match(/\/d\/([a-zA-Z0-9-_]+)/);
    if (!docIdMatch || docIdMatch.length < 2) {
      throw new Error('Invalid Google Doc URL');
    }
    const docId = docIdMatch[1];

    const privateKey = env.GOOGLE_PRIVATE_KEY || ''
    // Set up Google Auth
    const auth: GoogleAuth<AuthClient> = new google.auth.GoogleAuth({
      credentials: {
        client_email: env.GOOGLE_CLIENT_EMAIL,
        private_key: privateKey.replace(/\\n/g, '\n'),
      },
      scopes: ['https://www.googleapis.com/auth/documents.readonly'],
    });

    // Moderate the Google Doc
    const result = await moderator.moderateGoogleDoc(docId, auth);
    return JSON.stringify(result);
  } else if (text) {
    // Moderate the provided text
    const result = await moderator.analyzeText(text);
    return JSON.stringify(result);
  } else {
    throw new Error('Either text or docUrl must be provided');
  }
};
