---
title: NavList
componentName: NavList
patternCategory: Layouts
link: [](https://material-ui.com/components/lists/#lists)
---

```
<List
  component="nav"
  aria-labelledby="nested-list-subheader"
  subheader={
    <ListSubheader component="div" id="nested-list-subheader">
      Nested List Items
    </ListSubheader>
  }
  className={classes.root}
>
  <ListItem button>
    <ListItemIcon>
      <SendIcon />
    </ListItemIcon>
    <ListItemText primary="Sent mail" />
  </ListItem>
  <ListItem button>
    <ListItemIcon>
      <DraftsIcon />
    </ListItemIcon>
    <ListItemText primary="Drafts" />
  </ListItem>
  <ListItem button onClick={handleClick}>
    <ListItemIcon>
      <InboxIcon />
    </ListItemIcon>
    <ListItemText primary="Inbox" />
    {open ? <ExpandLess /> : <ExpandMore />}
  </ListItem>
  <Collapse in={open} timeout="auto" unmountOnExit>
    <List component="div" disablePadding>
      <ListItem button className={classes.nested}>
        <ListItemIcon>
          <StarBorder />
        </ListItemIcon>
        <ListItemText primary="Starred" />
      </ListItem>
    </List>
  </Collapse>
</List>
```

This NavList is used to display sidebar menu on state explore pages