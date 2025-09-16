// constants.ts
const constantSet: number = 2; // 1 or 2

const defaultIssueId1 = 'ISSUE#2025-09-15T06:01:26.304Z';
const defaultIssueId2 = 'ISSUE#2025-09-15T23:54:16.239Z';
export const defaultIssueId = constantSet === 1 ? defaultIssueId1 : defaultIssueId2;

const defaultPriority1 = 999500;
const defaultPriority2 = 500000;
export const defaultPriority = constantSet === 1 ? defaultPriority1 : defaultPriority2;

const defaultProUrl1 = 'https://www.youtube.com/embed/H3g_kpQHr4M?si=dBR-FdfIJ1NuXryY';
const defaultProUrl2 = 'https://www.youtube.com/embed/H3g_kpQHr4M?si=dBR-FdfIJ1NuXryY';
export const defaultProUrl = constantSet === 1 ? defaultProUrl1 : defaultProUrl2;

const defaultConUrl1 = 'https://drive.google.com/file/d/1CFM6-2h3vrdqx4TVkRZWh7RUTNU3bsMb/preview';
const defaultConUrl2 = 'https://drive.google.com/file/d/1CFM6-2h3vrdqx4TVkRZWh7RUTNU3bsMb/preview';
export const defaultConUrl = constantSet === 1 ? defaultConUrl1 : defaultConUrl2;

export const defaultProIsPdf = true;
export const defaultConIsPdf = true;


const proAuthorId1 = "truthLover1@example.com";
const proAuthorId2 = "truthLover2@example.com";
export const defaultProAuthor = constantSet === 1 ? proAuthorId1 : proAuthorId2;

const conAuthorId1 = "denier1@example.com";
const conAuthorId2 = "denier2@example.com";
export const defaultConAuthor = constantSet === 1 ? conAuthorId1 : conAuthorId2;


const defaultClaim1 = 'There is no meaningful sense in which Tyler Robinson is left-wing. To claim that he is is irresponsible and intentionally divisive.';
const defaultClaim2 = 'The left has perpetrated less political violence than the right';
export const defaultClaim = constantSet === 1 ? defaultClaim1 : defaultClaim2;

