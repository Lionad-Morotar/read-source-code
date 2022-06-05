const booleanAttributes =
  'allowfullscreen,async,autofocus,autoplay,checked,compact,controls,declare,' +
  'default,defaultchecked,defaultmuted,defaultselected,defer,disabled,' +
  'enabled,formnovalidate,hidden,indeterminate,inert,ismap,itemscope,loop,multiple,' +
  'muted,nohref,noresize,noshade,novalidate,nowrap,open,pauseonexit,readonly,' +
  'required,reversed,scoped,seamless,selected,sortable,' +
  'truespeed,typemustmatch,visible'.split(',')

// some attrs trited as true no matther what the value is,
// for example <input disabled="false"> is trited as disabled,
// so these attrs should be removed if the value is false
export function isBooleanAttr (attr) {
  return booleanAttributes.includes(attr)
}