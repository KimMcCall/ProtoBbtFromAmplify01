// ContactUsPage.tsx

import PageWrapper from "../components/PageWrapper";

function ContactUsPage() {
  return (
    <PageWrapper>
      <div>
        <h2>Contact Us</h2>
        <p>
          Our main provision for visitors to give us feedback or to make suggestions is through
          our <a href="/suggest">Suggestions page</a>, which allows us to keep Suggestions
          in our tracking system.
        </p>
        <p>
          That said, if you have any questions or if you need assistance, please reach out to us at:
          &nbsp;<a href="mailto:info@truthsquad.com">info@truthsquad.com</a>
        </p>
      </div>
    </PageWrapper>
  );
}

export default ContactUsPage;
