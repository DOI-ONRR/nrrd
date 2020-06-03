---
title: Accordions
componentName: Accordion
patternCategory: Layouts
---

```
<ExpansionPanel expanded={expanded === 'panel1'} onChange={handleChange('panel1')}>
  <ExpansionPanelSummary
    expandIcon={<ExpandMoreIcon />}
    aria-controls="panel1bh-content"
    id="panel1bh-header"
  >
    <Typography className={classes.heading}>General settings</Typography>
    <Typography className={classes.secondaryHeading}>I am an expansion panel</Typography>
  </ExpansionPanelSummary>
  <ExpansionPanelDetails>
    <Typography>
      Nulla facilisi. Phasellus sollicitudin nulla et quam mattis feugiat. Aliquam eget
      maximus est, id dignissim quam.
    </Typography>
  </ExpansionPanelDetails>
</ExpansionPanel>
```

Accordions are collapsible panels that provide users with the ability to expand
and collapse content as needed. They can simplify the interface by hiding
content until it is needed.

With so much data, hiding some is essential. This is especially true for mobile
where some content shown by default in the desktop view becomes hidden.


## How to use

The toggle behavior is triggered by the `aria-` attributes. `aria-controls` on the toggle should be set to the
`id` of the expandable content container.


## Responsive behavior

See individual variants for responsive behavior.


## Variants


### Plus-button

Floating accordion unit, used with county maps on Explore state pages.


### In-table


### Mobile

This is a special case of the accordion that occurs within the `.chart-list`
component. On larger screens, the content is expanded an no toggle exists. On
smaller screens, the toggle is visible and the accordion is collapsed by
default.


### Mobile-menu

This is a special case of the accordion used on small screens to provide a
toggleable menu. It is hidden on larger screens.
