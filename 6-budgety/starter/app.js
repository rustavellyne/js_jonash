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
    incomeContainer: '.income__list',
    expensesContainer: '.expenses__list',
	};
	return {
		getInput: function () {
			var type = document.querySelector(DOMstrings.inputType).value;
			var description = document.querySelector(DOMstrings.inputDescr).value;
			var value = parseFloat(document.querySelector(DOMstrings.inputValue).value);
		return {
				type,
				description,
				value,
			}
		},
    addListItem: function (obj, type) {
      /**
       * create HTML string with placeholder text
       */
      var template, newHtml, element;
      if (type === 'inc') {
        element = DOMstrings.incomeContainer;
        template = `
        <div class="item clearfix" id="income-%id%">
          <div class="item__description">%description%</div>
          <div class="right clearfix">
              <div class="item__value">%value%</div>
              <div class="item__delete">
                  <button class="item__delete--btn">
                    <i class="ion-ios-close-outline"></i>
                  </button>
              </div>
          </div>
      </div>
      `;
      } else if (type === 'exp') {
        element = DOMstrings.expensesContainer;
        template = `
       <div class="item clearfix" id="expense-%id%">
          <div class="item__description">%description%</div>
          <div class="right clearfix">
              <div class="item__value">%value%</div>
              <div class="item__percentage">21%</div>
              <div class="item__delete">
                  <button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button>
              </div>
          </div>
      </div>
      `;
      }
    
      /**
       * Replace placeholder text with some actual data
       */
      newHtml = template.replace('%id%', obj.id);
      newHtml = newHtml.replace('%description%', obj.description);
      newHtml = newHtml.replace('%value%', obj.value)

      /**
       * Insert template before end DOM
       */
      document.querySelector(element).insertAdjacentHTML('beforeend', newHtml);
    },
    clearFields: function () {
      var fields;
      fields = document.querySelectorAll(`${DOMstrings.inputDescr}, ${DOMstrings.inputValue}`);
      [].forEach.call(fields, function(cur, i, arr) {
        cur.value = '';
      });
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

  var updateBudget  = function () {
    /**
     * 1. Calculate the budget
     */
    
    /**
     * 2. Return the budget 
     */
    
    /**
     * 5. Display the budget on the UI
     */
  }

	var ctrlAddItem = function() {
		//1 Get the field input data
		var input = UICtrl.getInput();
		var {type, description, value} = input;
    if (!description || isNaN(value) || value <= 0) {
      return false;
    }
		//2. Add the item to the budget controller
		var newItem = budgetCtrl.addItem(type, description, value)
	   
    //3.Add the item to the UI
    UICtrl.addListItem(newItem, type);
    //4 . clear the fields
    UICtrl.clearFields();

    /**
     * 5. Calculate and update budget
     */
    updateBudget();
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