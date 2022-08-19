
# U.S. Department of the Interior Natural Resource Revenue Data

This is the repository for active development work on [revenuedata.doi.gov](https://revenuedata.doi.gov). See [releases](https://github.com/ONRR/nrrd/releases) for information about the current version of the site.

**For more detailed process, development, and data information, please see our [repository's wiki](https://github.com/ONRR/nrrd/wiki).**

## What

The U.S. earns revenue on natural resources (such as oil, gas, coal and geothermal(s) extracted from federal lands and waters. This is a major source of revenue for both the federal government, state governments, and local municipalities.

This repository contains the code for revenuedata.doi.gov, which is a website that includes both curated content and raw data to better inform the national and international conversation around extractive industries revenue. It will provide data visualizations and information that’s  understandable to members of the public and can be re-used through other media and applications.

For more information about the history of the site, see [about this site](https://revenuedata.doi.gov/about/).

## Contributing
Content and feature suggestions are welcome via [GitHub Issues](https://github.com/ONRR/nrrd/issues). Code contributions are welcome via [pull request](https://help.github.com/articles/using-pull-requests/), although of course we cannot guarantee your changes will be included in the site.

### Public domain

This project is in the worldwide [public domain](LICENSE.md). As stated in [CONTRIBUTING](CONTRIBUTING.md):

> This project is in the public domain within the United States, and copyright and related rights in the work worldwide are waived through the [CC0 1.0 Universal public domain dedication](https://creativecommons.org/publicdomain/zero/1.0/).
>
> All contributions to this project will be released under the CC0 dedication. By submitting a pull request, you are agreeing to comply with this waiver of copyright interest.

## Development Notes

### Testing 

For testing our website we use the following libraries and frameworks:

 - [ESLint](https://eslint.org/): Code syntax and formatting
 - [Jest](https://jestjs.io/en/): Javascript Testing Framework
 - [react-testing-library](https://testing-library.com/docs/intro): Integration, Unit testing
 - [puppeteer](https://github.com/puppeteer/puppeteer): End to End testing
 - [lighthouse](https://github.com/GoogleChrome/lighthouse): Performance and Accessibility testing

The goal is to have 100% test coverage to support our Test Driven Development (TDD), continuous integration and ensure quality code delivery and user experience.

We use CircleCI to run our tests when a change is committed to our code base. Of course all tests can be run from the development environment. 

## Pattern Library
### Edit Content for notes on colors:
The key is the text you see on the card. You can add one or multiple keys. Use the following code.
```
<PaletteDisplay>
  <div noteKeys={['common']}>
    common colors documentation
  </div>
  <div noteKeys={['common.black']}>
    common black colors documentation
  </div>
</PaletteDisplay>
```
### Edit Content for notes on iconogrpahy:
The key is the text you see on the card. You can add one or multiple keys. Use the following code.
```
<IconographyDisplay>
  <div noteKeys={['FilterTableIconImg']}>Icon is used on home page</div>
</IconographyDisplay>
```
### Edit Content for notes on typography:
The key is the text you see on the card. You can add one or multiple keys. Use the following code.
```
<TypographyDisplay>
  <div noteKeys={['h1']}>Icon is used on home page</div>
</TypographyDisplay>
```
### Edit Content for Components:
For components all documentation maintained in the code for the component. To add comments for the component description, you can add/edit the comment at the top of the declaration for the component in the code file. The name of the file and the name of the component will match.
```
/**
 * The DidYouKnowCard is used in the about section of the website. It is a simple card that can display
 * content. Other components can be added in the content such as a collapsible component that can add more content.
 *
 */
const DidYouKnowCard = ({ children, title = 'Did you know?' }) => {
  ...Bunch of code
}
```
