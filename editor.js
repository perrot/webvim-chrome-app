    $( "#open" ).button({
      text: false,
      icons: {
        primary: "ui-icon-folder-open"
      }
    });
    $( "#newtab" ).button({
      text: false,
      icons: {
        primary: "ui-icon-newwin"
      }
    })
    .click(function() {
    addTab();
        //alert( "Running the last action" );
      });
    $( "#opentab" ).button({
      text: false,
      icons: {
        primary: "ui-icon-mail-open"
      }
    })
    .click(function() {
    openTab();
        //alert( "Running the last action" );
      });
    $( "#new" ).button({
      text: false,
      icons: {
        primary: "ui-icon-document"
      }
    })
    .click(function() {
    editNew();
        //alert( "Running the last action" );
      });

    $( "#save" ).button({
      text: false,
      icons: {
        primary: "ui-icon-disk"
      }
    })
    .click(function() {
      download('test.txt', editor.doc.getValue());
      });
    $( "#undo" ).button({
      text: false,
      icons: {
        primary: "ui-icon-arrowreturnthick-1-w"
      }
    });
    $( "#redo" ).button({
      text: false,
      icons: {
        primary: "ui-icon-arrowreturnthick-1-e"
      }
    });
    $( "#theme" )
      .button({
          text: false,
          icons: {
            primary: "ui-icon-image"
          }
      })
      .click(function() {
        //alert( "Running the last action" );
      })
      .next()
        .button({
          text: false,
          icons: {
            primary: "ui-icon-triangle-1-s"
          }
        })
        .click(function() {
          var menu = $( this ).parent().next().show().position({
            my: "left top",
            at: "left bottom",
            of: this
          });
          $( document ).one( "click", function() {
	    console.log(menu);
            menu.hide();
          });
          return false;
        })
        .parent()
          .buttonset()
          .next()
            .hide()
            .menu();
    $( "#file" ).buttonset();
    $( "#edit" ).buttonset();
    $("#themeSet").buttonset();
    $("#tabSet").buttonset();
    $("#theme").attr("disabled",true);
    //tab section start
  var tabTitle = $( "#tab_title" ),
      tabContent = $( "#tab_content" ),
      tabTemplate = "<li><a id='#{labelid}' href='#{href}' onclick='selectLabel(this)'>#{label}</a> <span class='ui-icon ui-icon-close' role='presentation'>Remove Tab</span></li>",
      tabCounter = 1;
 
    var tabs = $( "#tabs" ).tabs();
 
    // modal dialog init: custom buttons and a "close" callback reseting the form inside
    var dialog = $( "#dialog" ).dialog({
      autoOpen: false,
      modal: true,
      buttons: {
        Add: function() {
          addTab();
          $( this ).dialog( "close" );
        },
        Cancel: function() {
          $( this ).dialog( "close" );
        }
      },
      close: function() {
        form[ 0 ].reset();
      }
    });
 
    // addTab form: calls addTab function on submit and closes the dialog
    var form = dialog.find( "form" ).submit(function( event ) {
      addTab();
      dialog.dialog( "close" );
      event.preventDefault();
    });

   // var currentLabel=$("#labels-1");
    function selectLabel(obj){
	console.log("==== {{{selectLabel ====");
        //console.log("select label:"+obj.id);
	//console.log(editor);
	editor=editors["code-"+String.fromCharCode(parseInt(obj.id.substring(obj.id.indexOf('-')+1))+96)]
    	currentLabel=$("#"+obj.id);
	//remove label focus
	currentLabel.blur();
	console.log(document.activeElement);
	console.log("set textarea focus");
        $(currentLabel.attr("href")+" textarea").focus();
	console.log("textarea focused");
	console.log(document.activeElement);
	console.log($(currentLabel.attr("href")+" textarea"));
	console.log(currentLabel);
	console.log(currentLabel.text());
	console.log($("#labels-1"));
	console.log($("#labels-2"));
	console.log("==== selectLabel}}} ====");
    }
    
    function openTab(){
    	addTab();
	$("#files").click();
    }
    function editNew(){
	editor.doc.setValue('');
    }
 
    // actual addTab function: adds new tab using the input from the form above
    function addTab() {
      var label = "[No Name]",//tabTitle.val() || "Tab " + tabCounter,
        id = "tabs-" + tabCounter,
        li = $( tabTemplate.replace( /#\{href\}/g, "#" + id ).replace( /#\{label\}/g, label ).replace( /#\{labelid\}/g, "labels-"+tabCounter ) ),
        tabContentHtml = "";//tabContent.val() || "Tab " + tabCounter + " content.";
 
      tabs.find( ".ui-tabs-nav" ).append( li );
      tabs.append( "<div style='padding:0' id='" + id + "'><textarea  id='code-"+String.fromCharCode(96 +tabCounter)+"' name='code'>" + tabContentHtml + "</textarea></div>" );
      tabs.tabs( "refresh" );
      editor=CodeMirror.fromTextArea(document.getElementById("code-"+String.fromCharCode(96 +tabCounter)), {
        lineNumbers: true,
        mode: "text/x-csrc",
        vimMode: true,
        showCursorWhenSelecting: true,
	lineWrapping: true,
    	extraKeys: {
		"Ctrl-Q": function(cm){
		  cm.foldCode(cm.getCursor());
		  console.log("EK:"+cm.hasFocus()); 
		},
		"Ctrl-Insert":function(){
		  addTab();
		},
		"Ctrl-Delete":function(){
		  removeTab();
		},
		"F11": function(cm) {
		  console.log("==== F11 ====");
		  cm.setOption("fullScreen", !cm.getOption("fullScreen"));
		  console.log(cm.getOption("fullScreen"));
		}
	},
    	foldGutter: {
    		rangeFinder: new CodeMirror.fold.combine(CodeMirror.fold.brace, CodeMirror.fold.comment) 
	},    
    	gutters: ["CodeMirror-linenumbers", "CodeMirror-foldgutter"],
	styleActiveLine: true,
	matchBrackets: true,
	autofocus:true
      });

      editors["code-"+String.fromCharCode(96 +tabCounter)]=editor;
      //comment below line because error:Refused to execute inline event handler because it violates the following Content Security Policy directive
      $("#labels-"+tabCounter).click();
      editor.doc.setValue('');
      $("#tabs-"+tabCounter+" textarea").focus();
      console.log("==== {{addtab ====");
      console.log(editor.doc.getValue());
      console.log("==== addtab}} ====");
      tabCounter++;
    }
 
function removeTab()
{
      console.log("==== {{{removeTab ===");
      var panelId = currentLabel.attr("href");
      console.log(panelId);
      $( panelId ).remove();
      tabs.tabs( "refresh" );
      console.log("==== removeTab}}} ===");
}
    // close icon: removing the tab on click
    tabs.delegate( "span.ui-icon-close", "click", function() {
      console.log("==== {{{close icon ===");
      var panelId = $( this ).closest( "li" ).remove().attr( "aria-controls" );
      console.log("#"+panelId);
      $( "#" + panelId ).remove();
      tabs.tabs( "refresh" );
      console.log("==== close icon}}} ===");
    });
 
    tabs.bind( "keyup", function( event ) {
      if ( event.altKey && event.keyCode === $.ui.keyCode.BACKSPACE ) {
        var panelId = tabs.find( ".ui-tabs-active" ).remove().attr( "aria-controls" );
        $( "#" + panelId ).remove();
        tabs.tabs( "refresh" );
      }
    });
//tab section end    
    //console.log($( "#labels-1").text());
    //console.log($( "#labels-1").text("hello"));
    var editors = new Array();
    var editor;
    /*
      var editor = CodeMirror.fromTextArea(document.getElementById("code-a"), {
        lineNumbers: true,
        mode: "text/x-csrc",
        vimMode: true,
        showCursorWhenSelecting: true,
	lineWrapping: true,
    	extraKeys: {
	"Ctrl-Q": function(cm){
	  cm.foldCode(cm.getCursor()); 
	},
	"Ctrl-Insert":function(){
	  addTab();
	},
	"F11": function(cm) {
	  console.log("==== F11 ====");
          cm.setOption("fullScreen", !cm.getOption("fullScreen"));
	  console.log(cm.getOption("fullScreen"));
        },
        "Esc": function(cm) {
          if (cm.getOption("fullScreen")) cm.setOption("fullScreen", false);
        }
	},
    	foldGutter: {
    		rangeFinder: new CodeMirror.fold.combine(CodeMirror.fold.brace, CodeMirror.fold.comment) 
	},    
    	gutters: ["CodeMirror-linenumbers", "CodeMirror-foldgutter"],
	styleActiveLine: true,
	matchBrackets: true,
	autofocus:true
      });
      */
    //  editors["code-a"]=editor;
var input = document.getElementById("select");
  function selectTheme() {
    var theme = input.options[input.selectedIndex].innerHTML;
    editor.setOption("theme", theme);
  }
  var choice = document.location.search &&
               decodeURIComponent(document.location.search.slice(1));
  if (choice) {
    input.value = choice;
    editor.setOption("theme", choice);
  }
      
      //read file
    function readBlob(opt_startByte, opt_stopByte) {

    var files = document.getElementById('files').files;
    if (!files.length) {
      alert('Please select a file!');
      return;
    }

    var file = files[0];
    var start = parseInt(opt_startByte) || 0;
    var stop = parseInt(opt_stopByte) || file.size - 1;

    var reader = new FileReader();

    // If we use onloadend, we need to check the readyState.
    reader.onloadend = function(evt) {
      if (evt.target.readyState == FileReader.DONE) { // DONE == 2
        //document.getElementById('byte_content').textContent = evt.target.result;
	var ext="";
	console.log(currentLabel);
	console.log("when read file , the current label is: "+currentLabel.text());
	console.log("when read file , the current label is: "+currentLabel.text);
	currentLabel.text(file.name);
	ext=file.name.substring(file.name.lastIndexOf('.')+1);
	console.log(ext);
	switch(ext)
	{
		case "html":
		case "htm":
			var mixedMode = {
			name: "htmlmixed",
			scriptTypes: [{matches: /\/x-handlebars-template|\/x-mustache/i,
				       mode: null},
				      {matches: /(text|application)\/(x-)?vb(a|script)/i,
				       mode: "vbscript"}]
		      };
			editor.setOption("mode",mixedMode);
			//console.log(editor.doc.getMode().name);
			break;
		case "js":
			editor.setOption("mode","text/javascript");
			break;
		case "json":
			editor.setOption("mode","application/json");
			break;
		case "go":
			editor.setOption("mode","text/x-go");
			break;
		case "markdown":
		case "mdown":
		case "mkdn":
		case "md":
		case "mkd":
		case "mdwn":
		case "mdtxt":
		case "mdtext":
		case "text":
			editor.setOption("mode","text/x-markdown");
			break;
		case "py":
			editor.setOption("mode","text/x-python");
			break;
		case "xml":
			editor.setOption("mode","application/xml");
			break;
		case "pl":
			editor.setOption("mode","text/x-perl");
			break;
		case "php":
			editor.setOption("mode","text/x-php");
			break;
		case "rb":
			editor.setOption("mode","text/x-ruby");
			break;
		case "tcl":
			editor.setOption("mode","text/x-tcl");
			break;
		case "vb":
			editor.setOption("mode","text/x-vb");
			break;
		case "vbs":
			editor.setOption("mode","text/vbscript");
			break;
		case "cs":
			editor.setOption("mode","text/x-csharp");
			break;
		case "c":
			editor.setOption("mode","text/x-csrc");
			break;
		case "cpp":
			editor.setOption("mode","text/x-c++src");
			break;
		case "java":
			editor.setOption("mode","text/x-java");
			break;
		case "css":
			editor.setOption("mode","text/css");
			break;
	}
	editor.doc.setValue(evt.target.result);
        //document.getElementById('byte_range').textContent = 
        //    ['Read bytes: ', start + 1, ' - ', stop + 1,
        //     ' of ', file.size, ' byte file'].join('');
    console.log(document.activeElement);
      }
    };

    var blob = file.slice(start, stop + 1);
    reader.readAsBinaryString(blob);
	     console.log("2");
    console.log("==== }}}readBlob ===");
  }
function download(filename, text) {
    var pom = document.createElement('a');
    pom.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(text));
    pom.setAttribute('download', filename);
    pom.click();
}
 var onWritableFileToOpen = function(theFileEntry) {
  setFile(theFileEntry, true);
  readFileIntoEditor(theFileEntry);
};
function setFile(theFileEntry, isWritable) {
  fileEntry = theFileEntry;
  hasWriteAccess = isWritable;
}
var fileEntry;
var hasWriteAccess;
function readFileIntoEditor(theFileEntry) {
  if (theFileEntry) {
    theFileEntry.file(function(file) {
      var fileReader = new FileReader();

      fileReader.onload = function(e) {
        handleDocumentChange(theFileEntry.fullPath);
        editor.doc.setValue(e.target.result);
        //$(currentLabel.getAttribute("href")+" textarea").focus();
        $(currentLabel.attr("href")+" textarea").focus();
      };

      fileReader.onerror = function(e) {
        console.log("Read failed: " + e.toString());
      };

      fileReader.readAsText(file);
    }, errorHandler);
  }
}
 
function handleDocumentChange(title) {
  var mode = "javascript";
  var modeName = "JavaScript";
  if (title) {
    title = title.match(/[^/]+$/)[0];
    //document.getElementById("title").innerHTML = title;
    //document.title = title;
    currentLabel.text(title);
    if (title.match(/.json$/)) {
      mode = {name: "javascript", json: true};
      modeName = "JavaScript (JSON)";
    } else if (title.match(/.html$/)) {
      mode = "htmlmixed";
      modeName = "HTML";
    } else if (title.match(/.css$/)) {
      mode = "css";
      modeName = "CSS";
    }
  } else {
    //document.getElementById("title").innerHTML = "[no document loaded]";
  }
  editor.setOption("mode", mode);
  //document.getElementById("mode").innerHTML = modeName;
}
function errorHandler(e) {
  var msg = "";

  switch (e.code) {
    case FileError.QUOTA_EXCEEDED_ERR:
    msg = "QUOTA_EXCEEDED_ERR";
    break;
    case FileError.NOT_FOUND_ERR:
    msg = "NOT_FOUND_ERR";
    break;
    case FileError.SECURITY_ERR:
    msg = "SECURITY_ERR";
    break;
    case FileError.INVALID_MODIFICATION_ERR:
    msg = "INVALID_MODIFICATION_ERR";
    break;
    case FileError.INVALID_STATE_ERR:
    msg = "INVALID_STATE_ERR";
    break;
    default:
    msg = "Unknown Error";
    break;
  };

  console.log("Error: " + msg);
}
    $("#open").click(function() {
    chrome.fileSystem.chooseEntry({ type: 'openWritableFile' }, onWritableFileToOpen);

    	//$("#files").click();
    });
    $("#undo").click(function() {
	editor.doc.undo();
	if(editor.doc.historySize().undo==0)$(this).attr("disabled",true);
    });
    $("#redo").click(function() {
	editor.doc.redo();
	if(editor.doc.historySize().undo==0)$(this).attr("disabled",true);
    });
    addTab();
  //  document.getElementById("code-a").focus();
   // console.log(document.activeElement);
      console.log("....................."); 
    console.log(document.activeElement);
    console.log(document.getElementById("labels-1"));
//    var currentLabel=document.getElementById("labels-1");
    var currentLabel=$("#labels-1");
    console.log(currentLabel);
