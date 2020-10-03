var budgetController = (function() {
	var Expense = function (id, description, value) {
		this.id = id;
		this.description = description;
		this.value = value;
	}
	var Income = function (id, description, value) {
		this.id = id;
		this.description = description;
		this.value = value;
	}

	var data = {
		allItems: {
			exp: [],
			inc: [],
		},
		totals: {
			exp: 0,
			inc: 0,
		},
	};
	return {
		addItem: function (type, desc, val) {
			var newItem, ID;
			if (data.allItems[type].length == 0) {
				ID = 0;
			} else {
				ID = data.allItems[type][data.allItems[type].length - 1].id + 1;
			}
			
			if (type === 'exp') {
				newItem = new Expense(ID, desc, val)
			} else if (type === 'inc') {
				newItem = new Income(ID, desc, val)
			}

			data.allItems[type].push(newItem);

			return newItem;
		},
		testing: function() {
			console.log(data)
		}
	}

})();


var UIController = (function() {

	var DOMstrings = {
		inputType: '.add__type',
		inputDescr: '.add__description',
		inputValue: '.add__value',
		addBtn: '.add__btn',
	};
	return {
		getInput: function () {
			var type = document.querySelector(DOMstrings.inputType).value;
			var description = document.querySelector(DOMstrings.inputDescr).value;
			var value = document.querySelector(DOMstrings.inputValue).value;
		return {
				type,
				description,
				value,
			}
		},
		getDomStrings: function() {
			return DOMstrings;
		},
	};
})();

/**
 *	Global App controller
 */
var controller = (function(budgetCtrl, UICtrl){

	var ctrlAddItem = function() {
		//1 Get the field input data
		var input = UICtrl.getInput();
		var {type, description, value} = input;

		//2. Add the item to the budget controller
		var newItem = budgetCtrl.addItem(type, description, value)
	}

	var setupEventListeners = function() {
		var DOM = UICtrl.getDomStrings()
		document.querySelector(DOM.addBtn).addEventListener('click', ctrlAddItem);

		document.addEventListener('keypress', function (event) {
			if ( !(event.keyCode === 13 || event.which === 13)) {
				return false;
			}
			event.preventDefault();
			ctrlAddItem();
		});
	}

	
	return {
		init: function() {
			setupEventListeners();
		}
	}

	

})(budgetController, UIController);

controller.init()