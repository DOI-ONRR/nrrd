const filterTerms = glossaryTerm => {
  if (glossaryTerm !== undefined && glossaryTerm !== null && glossaryTerm !== '') {
    return (lazy(GLOSSARY_TERMS)
      .filter(function (term) {
        return (term.name.toLowerCase() === glossaryTerm.toLowerCase())
      })
      .toArray())
  }
  else {
    return lazy(GLOSSARY_TERMS).toArray()
  }
}

export default filterTerms