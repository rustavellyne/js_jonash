// Budget Controller
var budgetController = (function() {

	var Expense = function (id, description, value) {
		this.id = id;
		this.description = description;
		this.value = value;
		this.percentage = -1;
	};

	Expense.prototype.calcPercentage = function(totalIncome) {
		if(totalIncome == 0) {
			this.percentage = -1;
			return this.percentage;
		}
		return this.percentage = Math.round((this.value / totalIncome) * 100);
	};

	Expense.prototype.getPercentage = function () {
		return this.percentage;
	}

	var Income = function (id, description, value) {
		this.id = id;
		this.description = description;
		this.value = value;
	};

  	var calculateTotal = function (type) {
    	return data.totals[type] = data.allItems[type].reduce((sum, curr) => sum + curr.value, 0)
  	};

	var data = {
		allItems: {
			exp: [],
			inc: [],
		},
		totals: {
			exp: 0,
			inc: 0,
		},
    	budget: 0,
    	percentage: -1
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
	    calculateBudget: function () {
	      /**
	       * calculate total income and expenses
	       */
	        calculateTotal('exp');
	        calculateTotal('inc');
	      
	      /**
	       * Calculate the budget: income - expenses
	       */
	      data.budget = data.totals.inc - data.totals.exp;
	      
	      
	      /**
	       * calculate the percentages of income that we spent
	       */
	      if(data.totals.inc > 0) {
	        data.percentage = Math.round((data.totals.exp / data.totals.inc) * 100);
	      } else {
	        data.percentage = -1;
	      }
	    },
	    calculatePercentages: function () {
	    	data.allItems.exp.forEach(curr => curr.calcPercentage(data.totals.inc));
	    },
	    getPercentages: function () {
	    	return data.allItems.exp.map(curr => curr.getPercentage());	
	    },
	    deleteItem: function (type, id) {
	      var ids, index;

	      ids = data.allItems[type].map(val => val.id);
	      index = ids.indexOf(id);

	      if (index !== -1) {
	        data.allItems[type].splice(index, 1);
	      } 
	    },
	    getBudget: function () {
	      return {
	        budget: data.budget,
	        totalIncome: data.totals.inc,
	        totalExp: data.totals.exp,
	        percentage: data.percentage
	      }
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
	    budgetLabel: '.budget__value',
	    incomeLabel: '.budget__income--value',
	    expensesLabel: '.budget__expenses--value',
	    percentageLabel: '.budget__expenses--percentage',
	    container: '.container',
	    expPercLabel: '.item__percentage',
	    datelabel: '.budget__title--month',
	};

	var formatNumber =  function (num, type) {
    		var numSplit, int, dec, sign;

    		num = Math.abs(num);
    		num = num.toFixed(2);
    		numSplit = num.split('.');
    		int = numSplit[0];
    		dec = numSplit[1];

    		if (int.length > 3) {
    			int = int.substr(0, int.length - 3) + ',' + int.substr(int.length - 3, int.length);
    		}

    		sign = (type === 'exp') ? '-' : '+';

    		return `${sign} ${int}.${dec}`;	
    	}
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
        <div class="item clearfix" id="inc-%id%">
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
       <div class="item clearfix" id="exp-%id%">
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
      newHtml = newHtml.replace('%value%', formatNumber(obj.value, type))

      /**
       * Insert template before end DOM
       */
      document.querySelector(element).insertAdjacentHTML('beforeend', newHtml);
    },
    deleteListItem: function (selectorId) {
      var el = document.getElementById(selectorId);
      el.parentNode.removeChild(el);
    },
    clearFields: function () {
      var fields;
      fields = document.querySelectorAll(`${DOMstrings.inputDescr}, ${DOMstrings.inputValue}`);
      [].forEach.call(fields, function(cur, i, arr) {
        cur.value = '';
      });
    },
    displayBudget: function ({budget, totalIncome, totalExp, percentage}) {
    	var type = budget > 0 ? 'inc' : 'exp';
      document.querySelector(DOMstrings.budgetLabel).textContent = formatNumber(budget, type);
      document.querySelector(DOMstrings.incomeLabel).textContent = formatNumber(totalIncome, 'inc');
      document.querySelector(DOMstrings.expensesLabel).textContent = formatNumber(totalExp, 'exp');
      
      console.log(percentage)
      if (percentage > 0) {
        document.querySelector(DOMstrings.percentageLabel).textContent = percentage + '%';
      } else {
        document.querySelector(DOMstrings.percentageLabel).textContent = '---';
      }
    },
    	displayPercentages: function (percentages) {
    		var fields = document.querySelectorAll(DOMstrings.expPercLabel);

    		var nodeListForeach = function (list, callback) {
    			[].forEach.call(list, callback);
    		};

    		nodeListForeach(fields, function(current, index) {

    			if (percentages[index] > 0) {
    				current.textContent = percentages[index] + '%';
    			} else {
    				current.textContent = '---';
    			}
    			
    		});
    	},
    	displayMonth: function() {
    		var now, month, year;
    		now = new Date();
            month = now.toLocaleString('en-US', { month: 'long' });
    		year = now.getFullYear();
    		document.querySelector(DOMstrings.datelabel).textContent = `${month} ${year}`;
    	},
        changedType: function () {
            var fields = document.querySelectorAll(
                `${DOMstrings.inputType}, ${DOMstrings.inputDescr}, ${DOMstrings.inputValue}`
            );
            [].forEach.call(fields, val => val.classList.toggle('red-focus'));
            document.querySelector(DOMstrings.addBtn).classList.toggle('red')
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
    budgetCtrl.calculateBudget();
    /**
     * 2. Return the budget 
     */
    
    var budget = budgetCtrl.getBudget();
    /**
     * 5. Display the budget on the UI
     */
   UICtrl.displayBudget(budget)
  }

  var updatePercentages = function () {
    /**
     * 1. Calculate percentage
     */
    budgetCtrl.calculatePercentages();
    /**
     * 2. Read percentages from the budget controller
     */
    var percentages = budgetCtrl.getPercentages();
    /**
     * 3. Update the UI with the new percentages
     */
    UIController.displayPercentages(percentages);
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

    /**
     * 6. Calculate adn update percentages
     */
    updatePercentages();
  }
  var ctrlDeleteItem = function (event) {
    //FIX this
    var itemID, type, id;

    itemID = event.target.parentNode.parentNode.parentNode.parentNode.id;
    if(!itemID) {
      return false;
    }

    splitID = itemID.split('-');
    type = splitID[0];
    id = + splitID[1];

    /**
     * 1. delete the item from data structure
     */
    budgetCtrl.deleteItem(type, id);
    
    /**
     * 2. delete the item from the UI
     */
    UICtrl.deleteListItem(itemID);
    /**
     * 3. Update and show the new budget
     */
    updateBudget();

    /**
     * 4. Calculate adn update percentages
     */
    updatePercentages();
  };

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

        document.querySelector(DOM.container).addEventListener('click', ctrlDeleteItem)
	    document.querySelector(DOM.inputType).addEventListener('change', UICtrl.changedType)   
    }

	
	return {
		init: function() {
      	console.log('Application start');
        UIController.displayMonth();
        UICtrl.displayBudget({budget:0, totalIncome:0 , totalExp:0, percentage:0})
			setupEventListeners();
		}
	}

	

})(budgetController, UIController);

controller.init()