var NO_NAME="[No Name]";
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
      //download('test.txt', editor.doc.getValue());
      	  console.log("==== {{{save button ===");
	  handleSaveButton();
      	  console.log("==== save button}}} ===");
      });
      function handleSaveButton() {
  if (fileEntry && hasWriteAccess) {
    writeEditorToFile(fileEntry);
  } else {
    chrome.fileSystem.chooseEntry({ type: 'saveFile' }, onChosenFileToSave);
  }
}

var onChosenFileToSave = function(theFileEntry) {
  setFile(theFileEntry, true);
  writeEditorToFile(theFileEntry);
};
function writeEditorToFile(theFileEntry) {
  theFileEntry.createWriter(function(fileWriter) {
    fileWriter.onerror = function(e) {
      console.log("Write failed: " + e.toString());
    };

    var blob = new Blob([editor.getValue()]);
    fileWriter.truncate(blob.size);
    fileWriter.onwriteend = function() {
      fileWriter.onwriteend = function(e) {
        handleDocumentChange(theFileEntry.fullPath);
        console.log("Write completed.");
      };

      fileWriter.write(blob);
    }
  }, errorHandler);
}
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
	  console.log($('#themeList li.selected a').text());
	  console.log($(this));
	    console.log(menu);
    //var theme = input.options[input.selectedIndex].innerHTML;
    //editor.setOption("theme", theme);
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
      //tabTemplate = "<li id='ok'><a id='#{labelid}' href='#{href}' onclick='selectLabel(this)'>#{label}</a> <span class='ui-icon ui-icon-close' role='presentation'>Remove Tab</span></li>",
      tabTemplate = "<li><a id='#{labelid}' href='#{href}'>#{label}</a> <span class='ui-icon ui-icon-close' role='presentation'>Remove Tab</span></li>",
      tabCounter = 1,
      tabIndex = 1;
 
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
      	$("#tabs-"+tabIndex).hide();
	console.log("hide "+tabIndex);
	tabIndex=obj.id.substring(obj.id.find("-")+1);
      	$("#tabs-"+tabIndex).show();
      	$("#tabs-"+tabIndex+" textarea").focus();
	console.log("select tab:"+tabIndex);
        //console.log("select label:"+obj.id);
	//console.log(editor);
	editor=editors["code-"+String.fromCharCode(parseInt(obj.id.substring(obj.id.indexOf('-')+1))+96)]

	/*
    	currentLabel=$("#"+obj.id);
	console.log("tabIndex:"+tabIndex);
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
*/	
    }
    
    function openTab(){
    	addTab();
    	chrome.fileSystem.chooseEntry({ type: 'openWritableFile' }, onWritableFileToOpen);
    }
    function editNew(){
        fileEntry = null;
  	hasWriteAccess = false;
	handleDocumentChange(null);
    }
    // actual addTab function: adds new tab using the input from the form above
    function addTab() {
      var label = NO_NAME,//tabTitle.val() || "Tab " + tabCounter,
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
		"Ctrl-O":function(){
    		  chrome.fileSystem.chooseEntry({ type: 'openWritableFile' }, onWritableFileToOpen);
		},
		"Ctrl-H":function(){
		  //move to first tab
		  console.log("-- {{{Ctrl-H --");
		  console.log("tabCounter:"+tabCounter);
		  if(tabCounter-1>=1&&tabContent-1!=tabIndex)
		  {
      		  	$("#tabs-"+tabIndex).hide();
      			$("#labels-"+tabIndex).css('background-color','rgba(0, 0, 0, 0)');
			console.log("hide "+tabIndex);
			tabIndex=1;
      		  	$("#tabs-"+tabIndex).show();
      			$("#labels-"+tabIndex).css('background-color','white');
      		        $("#tabs-"+tabIndex+" textarea").focus();
			console.log("show");
		  }	
		},
		"Ctrl-L":function(){
		  //move to last tab
		  console.log("-- {{{Ctrl-L --");
		  console.log("tabCounter:"+tabCounter);
		  if(tabCounter-1>0 && tabIndex!=tabCounter-1)
		  {
      		  	$("#tabs-"+tabIndex).hide();
      			$("#labels-"+tabIndex).css('background-color','rgba(0, 0, 0, 0)');
			console.log("hide "+tabIndex);
			tabIndex=tabCounter-1;
      		  	$("#tabs-"+tabIndex).show();
      			$("#labels-"+tabIndex).css('background-color','white');
      			$("#tabs-"+tabIndex+" textarea").focus();
			console.log("show "+tabIndex);
		  }	
		},
		"Ctrl-J":function(){
		  //move to next tab
		  console.log("-- {{{Ctrl-J --");
		  console.log("tabIndex:"+tabIndex);
		  console.log("tabCounter:"+tabCounter);
		  if(tabIndex+1<=tabCounter-1)
		  {
      		  	$("#tabs-"+tabIndex).hide();
			console.log("hide "+tabIndex);
      			$("#labels-"+tabIndex).css('background-color','rgba(0, 0, 0, 0)');
		  	tabIndex++;
      			$("#labels-"+tabIndex).css('background-color','white');
      		  	$("#tabs-"+tabIndex).show();
      			$("#tabs-"+tabIndex+" textarea").focus();
			console.log("select tab "+tabIndex);
		  }	
		},
		"Ctrl-K":function(){
		  console.log("-- {{{Ctrl-K --");
		  console.log("tabIndex:"+tabIndex);
		  //move to previous tab
		  if(tabIndex-1>=1)
		  {
      		  	$("#tabs-"+tabIndex).hide();
      			$("#labels-"+tabIndex).css('background-color','rgba(0, 0, 0, 0)');
			console.log("hide "+tabIndex);
		  	tabIndex--;
      		  	$("#tabs-"+tabIndex).show();
      			$("#labels-"+tabIndex).css('background-color','white');
      			$("#tabs-"+tabIndex+" textarea").focus();
			console.log("select tab:"+tabIndex);
		  }	
		},
		"Ctrl-T":function(){
		  addTab();
		},
		"Cmd-S": function(instance) { handleSaveButton() },
                "Ctrl-S": function(instance) { handleSaveButton() },
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
      $("#tabs-"+tabCounter).show();
      editor.doc.setValue('');
      currentLabel=$("#labels-"+tabCounter)
      currentLabel.focus();
      if(tabCounter==1)
      $("#labels-"+tabCounter).css('background-color','white');
      else
      {
	     $("#labels-"+(tabCounter-1)).css('background-color','rgba(0, 0, 0, 0)');
	      $("#labels-"+tabCounter).css('background-color','white');
      }
      $("#tabs-"+tabCounter+" textarea").focus();
      console.log("==== {{addtab ====");
      console.log(tabCounter);
      console.log(editor.doc.getValue());
      console.log("==== addtab}} ====");
      tabIndex=tabCounter;
      
      console.log("show "+tabIndex);
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
    } else if (title.match(/.js$/)) {
      mode = "text/javascript";
      modeName = "JavaScript";
    } else if (title.match(/.py$/)) {
      mode = "text/x-python";
      modeName = "Python";
    } else if (title.match(/.xml$/)) {
      mode = "application/xml";
      modeName = "XML";
    } else if (title.match(/.pl$/)) {
      mode = "text/x-perl";
      modeName = "Perl";
    } else if (title.match(/.php$/)) {
      mode = "text/x-php";
      modeName = "PHP";
    } else if (title.match(/.rb$/)) {
      mode = "text/x-ruby";
      modeName = "Ruby";
    } else if (title.match(/.tcl$/)) {
      mode = "text/x-tcl";
      modeName = "TCL";
    } else if (title.match(/.vb$/)) {
      mode = "text/x-vb";
      modeName = "VB";
    } else if (title.match(/.vbs$/)) {
      mode = "text/vbscript";
      modeName = "VBScript";
    } else if (title.match(/.cs$/)) {
      mode = "text/x-csharp";
      modeName = "C#";
    } else if (title.match(/.c$/)) {
      mode = "text/x-csrc";
      modeName = "C";
    } else if (title.match(/.cpp$/)) {
      mode = "text/x-c++src";
      modeName = "C++";
    } else if (title.match(/.java$/)) {
      mode = "text/x-java";
      modeName = "Java";
    } else if (title.match(/.css$/)) {
      mode = "text/css";
      modeName = "CSS";
    } else if (title.match(/.go$/)) {
      mode = "text/x-go";
      modeName = "Go";
    } else if (title.match(/.markdown|.mdown|.mkdn|.md|.mkd|.mdwn|.mdtxt|.mdtext|.text$/)) {
      mode = "text/x-markdown";
      modeName = "Markdown";
    }else if (title.match(/.html|.htm$/)) {
      mode = "htmlmixed";
      modeName = "HTML";
    } else if (title.match(/.css$/)) {
      mode = "css";
      modeName = "CSS";
    }
  } else {
    //document.getElementById("title").innerHTML = "[no document loaded]";
    	currentLabel.text(NO_NAME);
	editor.doc.setValue('');
      	$(currentLabel.attr('href')+" textarea").focus();
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
    });
    $("#undo").click(function() {
	editor.doc.undo();
    });
    $("#redo").click(function() {
	editor.doc.redo();
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
