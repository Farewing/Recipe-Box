var Panel = ReactBootstrap.Panel, Accordion = ReactBootstrap.Accordion;
var ListGroup = ReactBootstrap.ListGroup,ListGroupItem = ReactBootstrap.ListGroupItem;
var Button = ReactBootstrap.Button, ButtonToolbar = ReactBootstrap.ButtonToolbar;
var Modal = ReactBootstrap.Modal;
var form = ReactBootstrap.form, Input = ReactBootstrap.Input;
var FormGroup = ReactBootstrap.FormGroup, ControlLabel = ReactBootstrap.ControlLabel;
var FormControl = ReactBootstrap.FormControl;



var storage = window.localStorage;
storage["recipeBook"] = '[{"title":"锅包肉", "ingredients":["猪里脊肉300克", "土豆淀粉150克", "白糖100克", "醋100克", "酱油，盐，葱，姜，蒜，香菜适量"]}, {"title":"肉段烧茄子", "ingredients":["猪肉",  "淀粉", "茄子", "鸡蛋清", "尖椒", "糖，酱油，盐，葱，姜，蒜适量"]}, {"title":"猪肉炖粉条", "ingredients":["重点：肥肉多一些的五花肉", "粉条", "自家酸菜", "盐，葱姜蒜，桂皮，生抽，老抽，花椒大料适量"]}]';

// var recipes = (typeof localStorage["recipeBook"] != "undefined") ? JSON.parse(localStorage["recipeBook"]) : [
//   {title: "Pumpkin Pie", ingredients: ["Pumpkin Puree", "Sweetened Condensed Milk", "Eggs", "Pumpkin Pie Spice", "Pie Crust"]}, 
//   {title: "Spaghetti", ingredients: ["Noodles", "Tomato Sauce", "(Optional) Meatballs"]}, 
//   {title: "Onion Pie", ingredients: ["Onion", "Pie Crust", "Sounds Yummy right?"]}
// ];

var recipes = JSON.parse(storage["recipeBook"]);
var globalTitle = "", globalIngredients = [], editKey = -1;


var IngredientList = React.createClass({
	render: function(){
		var ingredientList = this.props.ingredients.map(function(ingredient){
			return (
				<ListGroupItem>
          			{ingredient}
        		</ListGroupItem>
        	);
		});
		return (
			<ListGroup>
				{ingredientList}
			</ListGroup>
		);
	}
});


var Recipe = React.createClass({
	remove: function() {
		recipes.splice(this.props.index, 1);
		ReactDOM.render(<RecipeBook recipebook={recipes} />, document.getElementById("container"));		
	},
	edit: function() {
    	globalTitle = this.props.title;
    	globalIngredients = this.props.ingredients;
    	editKey = this.props.index;
    	document.getElementById("add").click();

  	},
	render: function() {
		return (
			<div>
				<h4 className="text-center">材料</h4> <hr />
				<IngredientList ingredients = {this.props.ingredients} />
				<ButtonToolbar>
          			<Button bsStyle="danger" id={"btn-del"+this.props.index} onClick={this.remove}>删除</Button>
          			<Button bsStyle="default" id={"btn-edit"+this.props.index} onClick={this.edit}>修改</Button>
        		</ButtonToolbar>
        	</div>
		);
	}
});

var RecipeBook = React.createClass({
	render: function() {
		var recipeBooks = this.props.recipebook.map(function(recipeindex, i){
			return (
				<Panel header={recipeindex.title} eventKey={i} bsStyle="success">
      				<Recipe title={recipeindex.title} ingredients={recipeindex.ingredients} index={i}/>
    			</Panel>
			);
		});
		return (
		<div>
			<Accordion>
				{recipeBooks}
			</Accordion>

		</div>
		);
	}
});



var ModalAdd = React.createClass({
	getInitialState() {
    	return { 
    		showModal: false
    	 };
    },
    componentDidMount: function() {
		$("#add").hide();
    },
	close: function() {
		globalTitle = "";
    	globalIngredients = [];
		this.setState({ showModal: false });
	},
	open: function() {
		this.setState({ showModal: true });
		if(document.getElementById("newName") && document.getElementById("newIngredients")) {
			document.getElementById("newName").value = globalTitle;
      		document.getElementById("newIngredients").value = globalIngredients.join(",");
      		if (globalTitle != "") {
        		$("#modalTitle").text("修改菜品");
      		}
		}
		else requestAnimationFrame(this.open);
	},
	save: function() {
		var newTitle = document.getElementById("newName").value;
		var newIngredients = document.getElementById("newIngredients").value.split(",");
		var newRecipes = recipes;
		if(editKey != -1) {
			newRecipes[editKey] = {title: newTitle, ingredients: newIngredients};
		} else {
			if(newTitle.length < 1) {
				newTitle = "未命名"
			}		
			newRecipes.push({title: newTitle, ingredients: newIngredients})
		}

		storage["recipeBook"] = newRecipes;
		ReactDOM.render(<RecipeBook recipebook={recipes} />, document.getElementById("container"));
		this.close();

	},
	add: function() {
		editKey = -1;
		this.open();
	},
	render: function() {
		return (
		<div>
			<Button onClick={this.open} id="add"></Button>
			<Button bsStyle="primary" bsSize="large" onClick={this.add} id="show">新增</Button>
        	<Modal show={this.state.showModal} onHide={this.close}>
        		<Modal.Header>
        			<Modal.Title id="modalTitle">添加菜品</Modal.Title>
          		</Modal.Header>
          		<Modal.Body>
          			<form>
            			<FormGroup>
              				<ControlLabel>菜名:</ControlLabel>
              				<FormControl componentClass="input" type="text" id="newName" placeholder="瞎填点啥呗。。"/>
            			</FormGroup>
            			<FormGroup>
              				<ControlLabel>所需材料:</ControlLabel>
              				<FormControl componentClass="textarea" id="newIngredients"></FormControl>
            			</FormGroup>
          			</form>
          		</Modal.Body> 
          		<Modal.Footer>
            		<Button bsStyle="primary" id="addButton" onClick={this.save}>保存</Button>
            		<Button bsStyle="default" onClick={this.close}>退出</Button>
          		</Modal.Footer>
        	</Modal>
        </div>
		);
	}
});

ReactDOM.render(<RecipeBook recipebook={recipes} />, document.getElementById("container"));

ReactDOM.render(<ModalAdd />, document.getElementById("button"));

