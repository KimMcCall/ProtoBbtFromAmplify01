// constants.ts
const constantSet: number = 2; // 1 or 2

const defaultIssueId1 = 'ISSUE#2025-09-15T06:01:26.304Z';
const defaultIssueId2 = 'ISSUE#2025-09-15T23:54:16.239Z';
export const defaultIssueId = constantSet === 1 ? defaultIssueId1 : defaultIssueId2;

const defaultPriority1 = 999500;
const defaultPriority2 = 500000;
export const defaultPriority = constantSet === 1 ? defaultPriority1 : defaultPriority2;

// AsBreadIsBroken: https://drive.google.com/file/d/1CFM6-2h3vrdqx4TVkRZWh7RUTNU3bsMb/preview
// MyStdProUrl: https://drive.google.com/file/d/1-e4lznWJuyg8j72VSSi51vn9ZAKkEC2z/preview
// MyStdConUrl: https://drive.google.com/file/d/1yUPJuEEeTwLZbzqSzDU0RK-oZ9Nm-I7m/preview
// NiecesSing: https://www.youtube.com/embed/H3g_kpQHr4M?si=dBR-FdfIJ1NuXryY

const stdProUrl = 'https://drive.google.com/file/d/1-e4lznWJuyg8j72VSSi51vn9ZAKkEC2z/preview';
const stdConUrl = 'https://drive.google.com/file/d/1yUPJuEEeTwLZbzqSzDU0RK-oZ9Nm-I7m/preview';
const niecesSingUrl = 'https://www.youtube.com/embed/H3g_kpQHr4M?si=dBR-FdfIJ1NuXryY';
const breadBrokenUrl = 'https://drive.google.com/file/d/1CFM6-2h3vrdqx4TVkRZWh7RUTNU3bsMb/preview';

const defaultProUrl1 = niecesSingUrl;
const defaultProUrl2 = stdProUrl;
export const defaultProUrl = constantSet === 1 ? defaultProUrl1 : defaultProUrl2;

const defaultConUrl1 = breadBrokenUrl;
const defaultConUrl2 = stdConUrl;
export const defaultConUrl = constantSet === 1 ? defaultConUrl1 : defaultConUrl2;

const defaultProIsPdf1 = false;
const defaultProIsPdf2 = true;
export const defaultProIsPdf = constantSet === 1 ? defaultProIsPdf1 : defaultProIsPdf2;

const defaultConIsPdf1 = false;
const defaultConIsPdf2 = true;
export const defaultConIsPdf = constantSet === 1 ? defaultConIsPdf1 : defaultConIsPdf2;

const proAuthorId1 = "truthLover1@example.com";
const proAuthorId2 = "truthLover2@example.com";
export const defaultProAuthor = constantSet === 1 ? proAuthorId1 : proAuthorId2;

const conAuthorId1 = "denier1@example.com";
const conAuthorId2 = "denier2@example.com";
export const defaultConAuthor = constantSet === 1 ? conAuthorId1 : conAuthorId2;


const defaultClaim1 = 'There is no meaningful sense in which Tyler Robinson is left-wing. To claim that he is is irresponsible and intentionally divisive.';
const defaultClaim2 = 'The left has perpetrated less political violence than the right';
export const defaultClaim = constantSet === 1 ? defaultClaim1 : defaultClaim2;

export const PlaceholderForEmptyUrl = 'No URL';
export const ProxyForNoUrlXP2 = 'NoURL_428b47f5-ebfe-46d5-a14b-ae4a9625de04';
export const PlaceholderForEmptyComment = 'No Comment';
export const ProxyForNoCommentXP2 = 'NoComment_b8d50a00-4b4e-4a36-be4c-b7e1cecd5cc1';
