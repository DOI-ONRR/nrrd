import * as DATA_FILTER_CONSTANTS from './data-filter-constants'
export { DATA_FILTER_CONSTANTS }
export * from './data-filter-constants'

export const REVENUE = 'Revenue'
export const PRODUCTION = 'Production'
export const DISBURSEMENTS = 'Disbursements'
export const DATA_TYPES = [REVENUE, PRODUCTION, DISBURSEMENTS]

// MDX Includes
export const QUERY_MDX_CONTACT_US = `contactUsMdx:mdx(frontmatter: {includeId: {eq: "contact-us"}}) {
  body
}`
