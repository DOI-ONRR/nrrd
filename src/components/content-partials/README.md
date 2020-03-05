# Content Partials

## Why
This dierectory contains mdx files that can be included in other mdx files as well as react components. These partials are used to allow content managers to easily update content that is used in multiple places in one spot. 

## How
Just add a file with title case and a .mdx extension.

### How to inlude in react components
To easily access the content partial in a react component, add the `includeId` variable in the frontmatter. A graphql query can then be made to easily filter and fine the content partial to inlcude in your component.

> Also as a good practice please add the graphql query for the content partial to the constants file so its easily accessed and the query doesnt have to be written in various files.