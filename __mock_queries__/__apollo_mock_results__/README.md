# Purpose

This directory contains all the result files that are used in the apollo query mocks. The purpose is too keep the apollo-query-mocks file from becoming to large to easily edit and update. So all mock data will be contained in result files.

# How to use

One way of easily adding data to the a result file is to copy and paste a console log output from the browser. Export the default object and then import the file into the apollo-query-mocks.js file to add the object to the results for the mock query.

## Naming convention
Use title case to describe the data that is being mocked and the add an underscore 'results'. This should allow developers to easily review the list of available data mocks to use in mock queries.