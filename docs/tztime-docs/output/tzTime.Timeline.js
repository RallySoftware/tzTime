Ext.data.JsonP.tzTime_Timeline({"tagname":"class","name":"tzTime.Timeline","extends":null,"mixins":[],"alternateClassNames":[],"aliases":{},"singleton":false,"requires":[],"uses":[],"enum":null,"override":null,"inheritable":null,"inheritdoc":null,"meta":{},"private":null,"id":"class-tzTime.Timeline","members":{"cfg":[{"name":"endBefore","tagname":"cfg","owner":"tzTime.Timeline","meta":{},"id":"cfg-endBefore"},{"name":"granularity","tagname":"cfg","owner":"tzTime.Timeline","meta":{},"id":"cfg-granularity"},{"name":"holidays","tagname":"cfg","owner":"tzTime.Timeline","meta":{},"id":"cfg-holidays"},{"name":"limit","tagname":"cfg","owner":"tzTime.Timeline","meta":{},"id":"cfg-limit"},{"name":"startOn","tagname":"cfg","owner":"tzTime.Timeline","meta":{},"id":"cfg-startOn"},{"name":"step","tagname":"cfg","owner":"tzTime.Timeline","meta":{},"id":"cfg-step"},{"name":"workDayEndBefore","tagname":"cfg","owner":"tzTime.Timeline","meta":{},"id":"cfg-workDayEndBefore"},{"name":"workDayStartOn","tagname":"cfg","owner":"tzTime.Timeline","meta":{},"id":"cfg-workDayStartOn"},{"name":"workDays","tagname":"cfg","owner":"tzTime.Timeline","meta":{},"id":"cfg-workDays"}],"property":[],"method":[{"name":"constructor","tagname":"method","owner":"tzTime.Timeline","meta":{},"id":"method-constructor"},{"name":"contains","tagname":"method","owner":"tzTime.Timeline","meta":{},"id":"method-contains"},{"name":"getAll","tagname":"method","owner":"tzTime.Timeline","meta":{},"id":"method-getAll"},{"name":"getAllRaw","tagname":"method","owner":"tzTime.Timeline","meta":{},"id":"method-getAllRaw"},{"name":"getIterator","tagname":"method","owner":"tzTime.Timeline","meta":{},"id":"method-getIterator"},{"name":"ticksThatIntersect","tagname":"method","owner":"tzTime.Timeline","meta":{},"id":"method-ticksThatIntersect"}],"event":[],"css_var":[],"css_mixin":[]},"linenr":8,"files":[{"filename":"Timeline.coffee.js","href":"Timeline.coffee.html#tzTime-Timeline"}],"html_meta":{},"statics":{"cfg":[],"property":[],"method":[],"event":[],"css_var":[],"css_mixin":[]},"component":false,"superclasses":[],"subclasses":[],"mixedInto":[],"parentMixins":[],"html":"<div><pre class=\"hierarchy\"><h4>Files</h4><div class='dependency'><a href='source/Timeline.coffee.html#tzTime-Timeline' target='_blank'>Timeline.coffee.js</a></div></pre><div class='doc-contents'><p>Allows you to specify a timeline with weekend, holiday and non-work hours knocked out and timezone precision.</p>\n\n<h2>Basic usage</h2>\n\n<pre><code>{TimelineIterator, Timeline, Time} = require('../')\n\ntl = new Timeline({\n  startOn: '2011-01-03',\n  endBefore: '2011-01-05',\n})\n\nconsole.log(t.toString() for t in tl.getAll())\n# [ '2011-01-03', '2011-01-04' ]\n</code></pre>\n\n<p>Notice how the endBefore, '2011-01-05', is excluded. Timelines are inclusive of the startOn and exclusive of the\nendBefore. This allows the endBefore to be the startOn of the next with no overlap or gap. This focus on precision\npervades the design of the Time library.</p>\n\n<p>Perhaps the most common use of Timeline is to return a Timeline of ISOStrings shifted to the correct timezone.\nSince ISOString comparisons give the expected chronological results and many APIs return their date/time stamps as\nISOStrings, it's convenient and surprisingly fast to do your own bucketing operations after you've gotten a Timeline\nof ISOStrings.</p>\n\n<pre><code>console.log(tl.getAll('ISOString', 'America/New_York'))\n# [ '2011-01-03T05:00:00.000Z', '2011-01-04T05:00:00.000Z' ]\n</code></pre>\n\n<h2>More advanced usage</h2>\n\n<p>Now let's poke at Timeline behavior a little more. Let's start by creating a more advanced Timeline:</p>\n\n<pre><code>tl = new Timeline({\n  startOn: '2011-01-02',\n  endBefore: '2011-01-07',\n  holidays: [\n    {month: 1, day: 1},  # Notice the lack of a year specification\n    '2011-01-04'  # Got January 4 off also in 2011. Allows ISO strings.\n  ]\n})\n</code></pre>\n\n<p><code>workDays</code> is already defaulted but you could have overridden it.</p>\n\n<pre><code>console.log(tl.workDays)\n# [ 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday' ]\n</code></pre>\n\n<p>Another common use case is to get a Timeline to return child Timelines. You see, Timelines can be thought of as\ntime boxes with a startOn and an endBefore. You might have a big time box for the entire x-axis for a chart\nbut if you want to bucket raw data into each tick on the x-axis, you'll need to know where each sub-time box starts\nand ends.</p>\n\n<pre><code>subTimelines = tl.getAll('Timeline')\nconsole.log((t.startOn.toString() + ' to ' + t.endBefore.toString() for t in subTimelines))\n# [ '2011-01-03 to 2011-01-05',\n#   '2011-01-05 to 2011-01-06',\n#   '2011-01-06 to 2011-01-07' ]\n</code></pre>\n\n<p>Notice how the first subTimeline went all the way from 03 to 05. That's because we specified 04 as a holiday.\nTimelines are contiguous without gaps or overlap. You can see that the endBefore of one subTimeline is always the startOn\nof the next.</p>\n\n<p>Now, let's create a Timeline with <code>hour</code> granularity and show of the concept that Timelines also serve as time boxes by\nlearning about the contains() method.</p>\n\n<pre><code>tl2 = new Timeline({\n  startOn: '2011-01-02T00',\n  endBefore: '2011-01-07T00',\n})\n</code></pre>\n\n<p><code>startOn</code> is inclusive.</p>\n\n<pre><code>console.log(tl2.contains('2011-01-02T00'))\n# true\n</code></pre>\n\n<p>But <code>endBefore</code> is exclusive</p>\n\n<pre><code>console.log(tl2.contains('2011-01-07T00'))\n# false\n</code></pre>\n\n<p>But just before <code>endBefore</code> is OK</p>\n\n<pre><code>console.log(tl2.contains('2011-01-06T23'))\n# true\n</code></pre>\n\n<p>All of the above comparisons assume that the <code>startOn</code>/<code>endBefore</code> boundaries are in the same timezone as the contains date.</p>\n\n<h2>Timezone sensitive comparisions</h2>\n\n<p>Now, let's look at how you do timezone sensitive comparisions.</p>\n\n<p>If you pass in a timezone, then it will shift the Timeline boundaries to that timezone to compare to the\ndate/timestamp that you pass in. This system is optimized to the pattern where you first define your boundaries without regard\nto timezone. Christmas day is a holiday in any timezone. Saturday and Sunday are non work days in any timezone. The iteration\nstarts on July 10th; etc. THEN you have a bunch of data that you have stored in a database in GMT. Maybe you've pulled\nit down from an API but the data is represented with ISOString. You then want to decide if the ISOString\nis contained within the iteration as defined by a particular timezone, or is a Saturday, or is during workhours, etc.\nThe key concept to remember is that the timebox boundaries are shifted NOT the other way around. It says at what moment\nin time July 10th starts on in a particular timezone and internally represents that in a way that can be compared to\nan ISOString.</p>\n\n<p>So, when it's 3am in GMT on 2011-01-02, it's still 2011-01-01 in New York. Using the above <code>tl2</code> timeline, we say:</p>\n\n<pre><code>console.log(tl2.contains('2011-01-02T03:00:00.000Z', 'America/New_York'))\n# false\n</code></pre>\n\n<p>But it's still 2011-01-06 in New York, when it's 3am in GMT on 2011-01-07</p>\n\n<pre><code>console.log(tl2.contains('2011-01-07T03:00:00.000Z', 'America/New_York'))\n# true\n</code></pre>\n</div><div class='members'><div class='members-section'><div class='definedBy'>Defined By</div><h3 class='members-title icon-cfg'>Config options</h3><div class='subsection'><div id='cfg-endBefore' class='member first-child not-inherited'><a href='#' class='side expandable'><span>&nbsp;</span></a><div class='title'><div class='meta'><span class='defined-in' rel='tzTime.Timeline'>tzTime.Timeline</span><br/><a href='source/Timeline.coffee.html#tzTime-Timeline-cfg-endBefore' target='_blank' class='view-source'>view source</a></div><a href='#!/api/tzTime.Timeline-cfg-endBefore' class='name expandable'>endBefore</a><span> : Time/ISOString</span></div><div class='description'><div class='short'>Must match granularity of startOn. ...</div><div class='long'><p>Must match granularity of startOn. Timeline will stop before returning this value.\n  You must specify 2 out of 3 of startOn, endBefore, and limit.</p>\n</div></div></div><div id='cfg-granularity' class='member  not-inherited'><a href='#' class='side expandable'><span>&nbsp;</span></a><div class='title'><div class='meta'><span class='defined-in' rel='tzTime.Timeline'>tzTime.Timeline</span><br/><a href='source/Timeline.coffee.html#tzTime-Timeline-cfg-granularity' target='_blank' class='view-source'>view source</a></div><a href='#!/api/tzTime.Timeline-cfg-granularity' class='name expandable'>granularity</a><span> : String</span></div><div class='description'><div class='short'>Used to determine the granularity of the ticks. ...</div><div class='long'><p>Used to determine the granularity of the ticks.\n  Note, this can be different from the granularity of startOn and endBefore. For example:</p>\n\n<pre><code>{\n  startOn: '2012-01', # Month Granularity\n  endBefore: '2012-02', # Month Granularity\n  granularity: Time.DAY # Day granularity\n}\n</code></pre>\n<p>Defaults to: <code>granularity of startOn or endBefore</code></p></div></div></div><div id='cfg-holidays' class='member  not-inherited'><a href='#' class='side expandable'><span>&nbsp;</span></a><div class='title'><div class='meta'><span class='defined-in' rel='tzTime.Timeline'>tzTime.Timeline</span><br/><a href='source/Timeline.coffee.html#tzTime-Timeline-cfg-holidays' target='_blank' class='view-source'>view source</a></div><a href='#!/api/tzTime.Timeline-cfg-holidays' class='name expandable'>holidays</a><span> : Array</span></div><div class='description'><div class='short'>An optional Array of either ISOStrings or JavaScript Objects (and you can mix and match). ...</div><div class='long'><p>An optional Array of either ISOStrings or JavaScript Objects (and you can mix and match). Example:</p>\n\n<pre><code>[{month: 12, day: 25}, {year: 2011, month: 11, day: 24}, \"2012-12-24\"]\n</code></pre>\n\n<p>   Notice how you can leave off the year if the holiday falls on the same day every year.</p>\n</div></div></div><div id='cfg-limit' class='member  not-inherited'><a href='#' class='side expandable'><span>&nbsp;</span></a><div class='title'><div class='meta'><span class='defined-in' rel='tzTime.Timeline'>tzTime.Timeline</span><br/><a href='source/Timeline.coffee.html#tzTime-Timeline-cfg-limit' target='_blank' class='view-source'>view source</a></div><a href='#!/api/tzTime.Timeline-cfg-limit' class='name expandable'>limit</a><span> : Number</span></div><div class='description'><div class='short'>You can specify limit and either startOn or endBefore and only get back this many. ...</div><div class='long'><p>You can specify limit and either startOn or endBefore and only get back this many.\n  You must specify 2 out of 3 of startOn, endBefore, and limit.</p>\n</div></div></div><div id='cfg-startOn' class='member  not-inherited'><a href='#' class='side expandable'><span>&nbsp;</span></a><div class='title'><div class='meta'><span class='defined-in' rel='tzTime.Timeline'>tzTime.Timeline</span><br/><a href='source/Timeline.coffee.html#tzTime-Timeline-cfg-startOn' target='_blank' class='view-source'>view source</a></div><a href='#!/api/tzTime.Timeline-cfg-startOn' class='name expandable'>startOn</a><span> : Time/ISOString</span></div><div class='description'><div class='short'>Unless it falls on a knocked out moment, this is the first value in the resulting Timeline\n  If it falls on a knocked...</div><div class='long'><p>Unless it falls on a knocked out moment, this is the first value in the resulting Timeline\n  If it falls on a knocked out moment, it will advance to the first appropriate moment after startOn.\n  You must specify 2 out of 3 of startOn, endBefore, and limit.</p>\n</div></div></div><div id='cfg-step' class='member  not-inherited'><a href='#' class='side expandable'><span>&nbsp;</span></a><div class='title'><div class='meta'><span class='defined-in' rel='tzTime.Timeline'>tzTime.Timeline</span><br/><a href='source/Timeline.coffee.html#tzTime-Timeline-cfg-step' target='_blank' class='view-source'>view source</a></div><a href='#!/api/tzTime.Timeline-cfg-step' class='name expandable'>step</a><span> : Number</span></div><div class='description'><div class='short'>Use -1 to march backwards from endBefore - 1. ...</div><div class='long'><p>Use -1 to march backwards from endBefore - 1. Currently any\n   values other than 1 and -1 are not well tested.</p>\n<p>Defaults to: <code>1 or -1</code></p></div></div></div><div id='cfg-workDayEndBefore' class='member  not-inherited'><a href='#' class='side expandable'><span>&nbsp;</span></a><div class='title'><div class='meta'><span class='defined-in' rel='tzTime.Timeline'>tzTime.Timeline</span><br/><a href='source/Timeline.coffee.html#tzTime-Timeline-cfg-workDayEndBefore' target='_blank' class='view-source'>view source</a></div><a href='#!/api/tzTime.Timeline-cfg-workDayEndBefore' class='name expandable'>workDayEndBefore</a><span> : Object</span></div><div class='description'><div class='short'>An optional object in the form {hour: 17, minute: 0}. ...</div><div class='long'><p>An optional object in the form {hour: 17, minute: 0}.\n  If minute is zero it can be omitted.</p>\n<p>Defaults to: <code>{hour: 24, minute: 60}</code></p></div></div></div><div id='cfg-workDayStartOn' class='member  not-inherited'><a href='#' class='side expandable'><span>&nbsp;</span></a><div class='title'><div class='meta'><span class='defined-in' rel='tzTime.Timeline'>tzTime.Timeline</span><br/><a href='source/Timeline.coffee.html#tzTime-Timeline-cfg-workDayStartOn' target='_blank' class='view-source'>view source</a></div><a href='#!/api/tzTime.Timeline-cfg-workDayStartOn' class='name expandable'>workDayStartOn</a><span> : Object</span></div><div class='description'><div class='short'>An optional object in the form {hour: 8, minute: 15}. ...</div><div class='long'><p>An optional object in the form {hour: 8, minute: 15}.\n  If minute is zero it can be omitted. If workDayStartOn is later than workDayEndBefore, then it assumes that you\n  work the night shift and your work  hours span midnight.</p>\n\n<p>  The use of workDayStartOn and workDayEndBefore only make sense when the granularity is \"hour\" or finer.</p>\n\n<p>  Note: If the business closes at 5:00pm, you'll want to leave workDayEndBefore to 17:00, rather\n  than 17:01. Think about it, you'll be open 4:59:59.999pm, but you'll be closed at 5:00pm. This also makes all of\n  the math work. 9am to 5pm means 17 - 9 = an 8 hour work day.</p>\n<p>Defaults to: <code>{hour: 0, minute: 0}</code></p></div></div></div><div id='cfg-workDays' class='member  not-inherited'><a href='#' class='side expandable'><span>&nbsp;</span></a><div class='title'><div class='meta'><span class='defined-in' rel='tzTime.Timeline'>tzTime.Timeline</span><br/><a href='source/Timeline.coffee.html#tzTime-Timeline-cfg-workDays' target='_blank' class='view-source'>view source</a></div><a href='#!/api/tzTime.Timeline-cfg-workDays' class='name expandable'>workDays</a><span> : String[]/String</span></div><div class='description'><div class='short'>List of days of the\n  week that you work on. ...</div><div class='long'><p>List of days of the\n  week that you work on. You can specify this as an Array of Strings (['Monday', 'Tuesday', ...]) or a single comma\n  seperated String (\"Monday,Tuesday,...\").</p>\n<p>Defaults to: <code>['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday']</code></p></div></div></div></div></div><div class='members-section'><div class='definedBy'>Defined By</div><h3 class='members-title icon-method'>Methods</h3><div class='subsection'><div id='method-constructor' class='member first-child not-inherited'><a href='#' class='side expandable'><span>&nbsp;</span></a><div class='title'><div class='meta'><span class='defined-in' rel='tzTime.Timeline'>tzTime.Timeline</span><br/><a href='source/Timeline.coffee.html#tzTime-Timeline-method-constructor' target='_blank' class='view-source'>view source</a></div><strong class='new-keyword'>new</strong><a href='#!/api/tzTime.Timeline-method-constructor' class='name expandable'>tzTime.Timeline</a>( <span class='pre'>config</span> ) : <a href=\"#!/api/tzTime.Timeline\" rel=\"tzTime.Timeline\" class=\"docClass\">tzTime.Timeline</a></div><div class='description'><div class='short'> ...</div><div class='long'>\n<h3 class=\"pa\">Parameters</h3><ul><li><span class='pre'>config</span> : Object<div class='sub-desc'>\n</div></li></ul><h3 class='pa'>Returns</h3><ul><li><span class='pre'><a href=\"#!/api/tzTime.Timeline\" rel=\"tzTime.Timeline\" class=\"docClass\">tzTime.Timeline</a></span><div class='sub-desc'>\n</div></li></ul></div></div></div><div id='method-contains' class='member  not-inherited'><a href='#' class='side expandable'><span>&nbsp;</span></a><div class='title'><div class='meta'><span class='defined-in' rel='tzTime.Timeline'>tzTime.Timeline</span><br/><a href='source/Timeline.coffee.html#tzTime-Timeline-method-contains' target='_blank' class='view-source'>view source</a></div><a href='#!/api/tzTime.Timeline-method-contains' class='name expandable'>contains</a>( <span class='pre'>date, [tz]</span> ) : Boolean</div><div class='description'><div class='short'> ...</div><div class='long'>\n<h3 class=\"pa\">Parameters</h3><ul><li><span class='pre'>date</span> : Time/Date/String<div class='sub-desc'><p>can be either a JavaScript date object or an ISO-8601 formatted string</p>\n</div></li><li><span class='pre'>tz</span> : String (optional)<div class='sub-desc'>\n</div></li></ul><h3 class='pa'>Returns</h3><ul><li><span class='pre'>Boolean</span><div class='sub-desc'><p>true if the date provided is within this Timeline.</p>\n\n<h2>Usage:</h2>\n\n<p>We can create a Timeline from May to just before July.</p>\n\n<pre><code>tl = new Timeline({\n  startOn: '2011-05',\n  endBefore: '2011-07'\n})\n\nconsole.log(tl.contains('2011-06-15T12:00:00.000Z', 'America/New_York'))\n# true\n</code></pre>\n</div></li></ul></div></div></div><div id='method-getAll' class='member  not-inherited'><a href='#' class='side expandable'><span>&nbsp;</span></a><div class='title'><div class='meta'><span class='defined-in' rel='tzTime.Timeline'>tzTime.Timeline</span><br/><a href='source/Timeline.coffee.html#tzTime-Timeline-method-getAll' target='_blank' class='view-source'>view source</a></div><a href='#!/api/tzTime.Timeline-method-getAll' class='name expandable'>getAll</a>( <span class='pre'>[tickType], [tz], [childGranularity]</span> ) : Time[]/Date[]/Timeline[]/String[]</div><div class='description'><div class='short'> ...</div><div class='long'>\n<h3 class=\"pa\">Parameters</h3><ul><li><span class='pre'>tickType</span> : String (optional)<div class='sub-desc'><p>An optional String that specifies what should be returned. Possible values are 'Time' (default),\n   'Timeline', 'Date' (javascript Date Object), and 'ISOString'.</p>\n</div></li><li><span class='pre'>tz</span> : String (optional)<div class='sub-desc'><p>A Sting specifying the timezone in the standard form,<code>America/New_York</code> for example. This is\n   required if <code>tickType</code> is 'Date' or 'ISOString'.</p>\n</div></li><li><span class='pre'>childGranularity</span> : String (optional)<div class='sub-desc'><p>When tickType is 'Timeline', this is the granularity for the startOn and endBefore of the\n   Timeline object that is returned.</p>\n</div></li></ul><h3 class='pa'>Returns</h3><ul><li><span class='pre'>Time[]/Date[]/Timeline[]/String[]</span><div class='sub-desc'><p>Returns all of the points in the timeline in chronological order. If you want them in the order specified by <code>step</code>\nthen use getAllRaw(). Note, the output of this function is memoized so that subsequent calls to getAll() for the\nsame Timeline instance with the same parameters will return the previously calculated values. This makes it safe\nto call it repeatedly within loops and means you don't need to worry about holding onto the result on the client\nside.</p>\n</div></li></ul></div></div></div><div id='method-getAllRaw' class='member  not-inherited'><a href='#' class='side expandable'><span>&nbsp;</span></a><div class='title'><div class='meta'><span class='defined-in' rel='tzTime.Timeline'>tzTime.Timeline</span><br/><a href='source/Timeline.coffee.html#tzTime-Timeline-method-getAllRaw' target='_blank' class='view-source'>view source</a></div><a href='#!/api/tzTime.Timeline-method-getAllRaw' class='name expandable'>getAllRaw</a>( <span class='pre'>[tickType], [tz], [childGranularity]</span> ) : Time[]/Date[]/Timeline[]/String[]</div><div class='description'><div class='short'> ...</div><div class='long'>\n<h3 class=\"pa\">Parameters</h3><ul><li><span class='pre'>tickType</span> : String (optional)<div class='sub-desc'><p>An optional String that specifies the type should be returned. Possible values are 'Time' (default),\n   'Timeline', 'Date' (javascript Date Object), and 'ISOString'.</p>\n</div></li><li><span class='pre'>tz</span> : String (optional)<div class='sub-desc'><p>A Sting specifying the timezone in the standard form,<code>America/New_York</code> for example. This is\n   required if <code>tickType</code> is 'Date' or 'ISOString'.</p>\n</div></li><li><span class='pre'>childGranularity</span> : String (optional)<div class='sub-desc'><p>When tickType is 'Timeline', this is the granularity for the startOn and endBefore of the\n   Timeline that is returned.</p>\n</div></li></ul><h3 class='pa'>Returns</h3><ul><li><span class='pre'>Time[]/Date[]/Timeline[]/String[]</span><div class='sub-desc'><p>Returns all of the points in the timeline. Note, this will come back in the order specified\nby step so they could be out of chronological order. Use getAll() if they must be in chronological order.</p>\n</div></li></ul></div></div></div><div id='method-getIterator' class='member  not-inherited'><a href='#' class='side expandable'><span>&nbsp;</span></a><div class='title'><div class='meta'><span class='defined-in' rel='tzTime.Timeline'>tzTime.Timeline</span><br/><a href='source/Timeline.coffee.html#tzTime-Timeline-method-getIterator' target='_blank' class='view-source'>view source</a></div><a href='#!/api/tzTime.Timeline-method-getIterator' class='name expandable'>getIterator</a>( <span class='pre'>[tickType], [tz], [childGranularity]</span> ) : TimelineIterator</div><div class='description'><div class='short'> ...</div><div class='long'>\n<h3 class=\"pa\">Parameters</h3><ul><li><span class='pre'>tickType</span> : String (optional)<div class='sub-desc'><p>An optional String that specifies what type should be returned on each call to next().\n  Possible values are 'Time' (default), 'Timeline', 'Date' (javascript Date Object), and 'ISOString'.</p>\n</div></li><li><span class='pre'>tz</span> : String (optional)<div class='sub-desc'><p>A Sting specifying the timezone in the standard form,<code>America/New_York</code> for example. This is\n  required if <code>tickType</code> is 'Date' or 'ISOString'.</p>\n</div></li><li><span class='pre'>childGranularity</span> : String (optional)<div class='sub-desc'><p>When tickType is 'Timeline', this is the granularity for the startOn and endBefore of the\n  Timeline that is returned.</p>\n</div></li></ul><h3 class='pa'>Returns</h3><ul><li><span class='pre'>TimelineIterator</span><div class='sub-desc'><p>Returns a new TimelineIterator using this Timeline as the boundaries.</p>\n</div></li></ul></div></div></div><div id='method-ticksThatIntersect' class='member  not-inherited'><a href='#' class='side expandable'><span>&nbsp;</span></a><div class='title'><div class='meta'><span class='defined-in' rel='tzTime.Timeline'>tzTime.Timeline</span><br/><a href='source/Timeline.coffee.html#tzTime-Timeline-method-ticksThatIntersect' target='_blank' class='view-source'>view source</a></div><a href='#!/api/tzTime.Timeline-method-ticksThatIntersect' class='name expandable'>ticksThatIntersect</a>( <span class='pre'>startOn, endBefore</span> ) : Array</div><div class='description'><div class='short'> ...</div><div class='long'>\n<h3 class=\"pa\">Parameters</h3><ul><li><span class='pre'>startOn</span> : Time/ISOString<div class='sub-desc'><p>The start of the time period of interest</p>\n</div></li><li><span class='pre'>endBefore</span> : Time/ISOString<div class='sub-desc'><p>The moment just past the end of the time period of interest</p>\n</div></li></ul><h3 class='pa'>Returns</h3><ul><li><span class='pre'>Array</span><div class='sub-desc'><p>Returns the list of ticks from this Timeline that intersect with the time period specified by the parameters\nstartOn and endBefore. This is a convenient way to \"tag\" a timebox as overlaping with particular moments on\nyour Timeline. A common pattern for Lumenize calculators is to use ticksThatIntersect to \"tag\" each snapshot\nand then do groupBy operations with an OLAPCube.</p>\n</div></li></ul></div></div></div></div></div></div></div>"});