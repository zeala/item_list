(function() {
    "use strict";
    let listItems;

    // retrieve data from the localstorage
    retrieveData();

    registerPartials();
    registerHelpers();
    renderPage();
    registerListeners();


    function retrieveData() {
        const storedData = localStorage.getItem('listItems');
        listItems = JSON.parse(storedData) || [];
    }

    function registerPartials() {
        Handlebars.registerPartial('item', document.getElementById('item').innerHTML);
    }

    function registerHelpers() {
        Handlebars.registerHelper('getListDescription', function(list) {
            return list.length === 0 ? 'No items added to the list' :
                list.length === 1 ? 'One item in the list' : `${list.length} items in the list`;

        });
        Handlebars.registerHelper('isListEmpty', function(list){
            return list.length === 0 ?  'list-description__empty' : 'list-description__not-empty';
        })
    }

    function registerListeners() {
        const button = document.getElementById('addNewItem');
        const inputField = document.getElementById('inputText');
        button.addEventListener('click', () => {
            const textValue = inputField.value;
            const listItem = {
                id: listItems.length,
                label: textValue
            };
            listItems.push(listItem);
            inputField.value = '';
            renderPage();
        });
    }

    function registerTemplateListeners() {
        let removeButtonElements = document.getElementsByClassName('removeButton');
        let removeButtons = Array.from(removeButtonElements);
        removeButtons.forEach((button) => {
            button.addEventListener('click', removeItemHandler)
        });
    }

    function removeItemHandler(event) {
        const targetId = event.target.id;
        for (let i = listItems.length - 1; i >= 0; i--) {
            if (listItems[i].id.toString() === targetId.toString()) {
                listItems.splice(i, 1);
                break;
            }
        }
        renderPage();
    }

    function renderPage() {
        let container = document.getElementById('content');
        let listContainerTemplate = document.getElementById('listContainer').innerHTML;
        let compiledTemplate = Handlebars.compile(listContainerTemplate);

        let context = {
            listItems: listItems
        };

        let compiledHTML = compiledTemplate(context);
        container.innerHTML = compiledHTML;

        registerTemplateListeners();

        // save the current data in the localstorage
        localStorage.setItem('listItems', JSON.stringify(listItems));
    }
})();