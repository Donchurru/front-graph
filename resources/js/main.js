
$( document ).ready(function() {
	Graph.initGraph();
});

var Graph = {
	graph : null,
	initGraph : function(){
		// warn the user when leaving
	  window.onbeforeunload = function() {
	    return "Make sure to save your graph locally before leaving :-)";
	  };

	  $('#mySidenav .closebtn').click(function(){
	  	Graph.graph.removeSelectFromNode();
	  	Graph.closeNav();
	  });

	  var docEl = document.documentElement,
	    bodyEl = document.getElementsByTagName('body')[0];

	  var width = window.innerWidth || docEl.clientWidth || bodyEl.clientWidth,
	    height = window.innerHeight || docEl.clientHeight || bodyEl.clientHeight;

	  var xLoc = width / 2 - 25,
	    yLoc = 100;

	  // initial node data
	  var nodes = [{
	    id: 0,
	    type: "table",
	    title: "TCDT050",
	    x: xLoc - 150,
	    y: yLoc - 150,
	    query: {
	      type: "sql",
	      tables: [
	        "TCDT050"
	      ],
	      "fields": [
	        "all"
	      ],
	      filters: [{
	        field: "TCDT050.CAMPO_EJEMPLO",
	        "operator": "<",
	        "value": 10
	      }],
	      matchers: []
	    }
	  }, {
	    id: 1,
	    type: "Actor",
	    title: "Standarizer",
	    x: xLoc - 100,
	    y: yLoc - 100,

	    actions: [{
	      "sourceField": "COD_ENT_ORIG",
	      "targetField": "COD_ENT",
	      "action": "left-pad",
	      "mask": "0000"
	    }, {
	      "sourceField": "COD_CENTRO_ORIG",
	      "targetField": "COD_CENTRO",
	      "action": "left-pad",
	      "mask": "0000"
	    }]
	  }, {
	    id: 2,
	    type: "Actor",
	    title: "Mandatory",
	    x: xLoc + 300,
	    y: yLoc + 150,

	    actions: [{
	      field: "COD_ENT_ORIG"
	    }, {
	      field: "COD_CENTRO_ORIG"
	    }]
	  }, {
	    id: 3,
	    type: "sql",
	    title: "DomainValidation",
	    x: xLoc + 200,
	    y: yLoc + 250,

	    query: {
	      type: "sql",
	      tables: [
	        "TCDT040"
	      ],
	      "fields": [
	        "all"
	      ],
	      filters: [{
	        field: "TCDT040.CATALOG_VERSION",
	        "operator": "=",
	        "value": 2
	      }],
	      matchers: [
	        "TCDT050.COD_ENT",
	        "TCDT040.COD_ENT"
	      ]
	    }
	  }, {
	    id: 4,
	    type: "table",
	    title: "TCDT050 (accepted)",
	    x: xLoc + 350,
	    y: yLoc - 350,

	  }, {
	    id: 5,
	    type: "table",
	    title: "TCDT050 (rejected)",
	    x: xLoc - 450,
	    y: yLoc + 350,

	  }];
	  var edges = [{
	    source: nodes[0],
	    target: nodes[1],
	    title: "rows"
	  }, {
	    source: nodes[1],
	    target: nodes[2],
	    title: "acceptedAndRejectedRows"
	  }, {
	    source: nodes[2],
	    target: nodes[3],
	    title: "acceptedRows"
	  }, {
	    source: nodes[2],
	    target: nodes[5],
	    title: "rejectedRows"
	  }, {
	    source: nodes[3],
	    target: nodes[4],
	    title: "acceptedRows"
	  }, {
	    source: nodes[3],
	    target: nodes[5],
	    title: "rejectedRows"
	  }];


	  /** MAIN SVG **/
	  var svg = d3.select("body").append("svg")
	    .attr("width", width)
	    .attr("height", height);
	  var graph = new GraphCreator(svg, nodes, edges);
	  graph.setIdCt(nodes.length + 1);
	  graph.setIdCt(6);
	  graph.updateGraph();
	  Graph.graph = graph;
	},
	onSelectNode : function () {
		Graph.openNav();
		var selectedNode = Graph.graph.state.selectedNode;
		$("#node-name").val(selectedNode.title);
		$("#node-type").val(selectedNode.metadata.type !=undefined ? selectedNode.metadata.type : selectedNode.type);
	},

	onDeselectNode : function () {
		Graph.closeNav();
	},

	openNav : function(){
		$("#mySidenav").animate({width: 'show'}, "fast");
		//var transform = Graph.graph.d3.transform($(Graph.graph.svgG[0][0]).attr("transform"));
		//transform.translate[0] = transform.translate[0] + 300;
		//$(Graph.graph.svgG[0][0]).attr("transform",transform.toString());
	},

	closeNav : function(){
		$("#mySidenav").animate({width: 'hide'}, "fast");
		//var transform = Graph.graph.d3.transform($(Graph.graph.svgG[0][0]).attr("transform"));
		//transform.translate[0] = transform.translate[0] - 300;
		//$(Graph.graph.svgG[0][0]).attr("transform",transform.toString());
	}
}