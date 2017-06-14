import request from './request';
import mtln from './multiline';
import { OWNER, REPO } from '../config';

export function getIssues () {
  return request.query(mtln`
    query {
      repository(owner: "${OWNER}", name: "${REPO}") {
        issues(first: 10, orderBy: {field: CREATED_AT, direction: DESC}) {
          nodes {
            id: number
            url
            title
            bodyText
            createdAt
            author {
              avatarUrl
              username:login
              resourcePath
              url
            }
          }
          totalCount
          pageInfo {
            endCursor
            hasNextPage
            hasPreviousPage
            startCursor
          }
        }
      }
    }
  `).then(res => res.data.data.repository.issues)
  .then(issues => ({
    ...issues,
    nodes: issues.nodes.filter(issue => issue.author.username === OWNER),
  }));
}

export function getIssue (id) {
  return request.query(mtln`
    query {
      repository(owner: "hackape", name: "blog") {
        issue(number: ${id}) {
          title
          body: bodyHTML
        }
      }
    }
  `);
}
