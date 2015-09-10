
//create a new to-d0 
function createNewToDo()
{
    var todoDictionary ={};// an empty javascript object 
 
    //prompt the user to enter to-do
    var todo = prompt("To-Do","");
    if(todo!=null)
    {
        if(todo=="")
        {
          alert("To-Do can't be empty!");   
        }
        else 
        {
          //append the new to-do with the table 
            todoDictionary = {check:0, text:todo};
            addTableRow(todoDictionary, false);//checkbox state for new to-do item is set as false.
        }
    }
}

//add a row to the table
var rowID =0;
function addTableRow(todoDictionary,appIsLoading)
{
  rowID+=1;
    var table = document.getElementById("dataTable");
    var rowCount = table.rows.length; //getting the number of rows in table
    var row = table.insertRow(rowCount);//insert row at position 'rowCount'
    
    //create the checkbox (cell 1)
    var cell1 = row.insertCell(0);
    var element1 = document.createElement("input");
    element1.type ="checkbox";//setting the type of input
    element1.name ="chkbox[]";
    element1.checked = todoDictionary["check"];//getting the value by passing key "check"
    element1.setAttribute("onclick","checkboxClicked()");
    element1.className="checkbox";
    cell1.appendChild(element1);
    
    //create the texbox  (cell 2)
    var cell2= row.insertCell(1);
    var element2 = document.createElement("input");
    element2.type="text";
    element2.name = "txtbox[]";
    element2.size=18;
    element2.id= "text" +rowID;
    element2.value= todoDictionary["text"]; //getting the value from dictionary
    element2.setAttribute("onchange", "saveToDoList()");//form event
    element2.className="textbox";
    cell2.appendChild(element2);
    
    //create the view button (cell 3)
    var cell3 = row.insertCell(2);
    var element3 = document.createElement("input");
    element3.type= "button";
    element3.id = rowID;  //setting the id of button 
    element3.value="View";
    element3.setAttribute("onclick","viewSelectedRow(document.getElementById('text' +this.id))");
    element3.className="viewButton";
    cell3.appendChild(element3);
    
    //create the delete button  (cell 4)
    var cell4 = row.insertCell(3);
    var element4 = document.createElement("input");
    element4.type="button";
    element4.value ="Delete";
    element4.setAttribute("onclick","deleteSelectedRow(this)");
    element4.className="deleteButton";
    cell4.appendChild(element4);
    
    //update the UI and save the to-do list 
    checkboxClicked(); //call whenever the state of checkbox is changed.
    saveToDoList();
    
    if(!appIsLoading) alert("Task Added Successfully.");
}
                          

//add the strike-through styling to completed tasks

function checkboxClicked()
{
    var table = document.getElementById("dataTable");
    var rowCount = table.rows.length;
    
    //loop through all rows of the table
    var i;
    for(i=0;i<rowCount;i++)
    {
     var row = table.rows[i];
        var chkbox = row.cells[0].childNodes[0];//targeting the input element here
        var textbox = row.cells[1].childNodes[0];//targetting the inpmut element textbox here
        
        //if the checkbox is checked, add the strike-through styling
        if(null !=chkbox && true == chkbox.checked)
        {
            if(null != textbox)
            {  
                textbox.style.setProperty("text-decoration","line-through");
            }
        }
        
        //if the checkbox isn't checked, remove the strike-through styling
        else
        {
            textbox.style.setProperty("text-decoration","none");
            
        }
    }
    
    //save the to-do list
    saveToDoList();
}
        
//view the content of the selected row
function viewSelectedRow(todoTextField)
{
  alert(todoTextField.value); //displays an alert containing full text of the to-do item   
}
   

//delete the selected row
function deleteSelectedRow(deleteButton)
{
 var p = deleteButton.parentNode.parentNode;//it will be <tr> element
    p.parentNode.removeChild(p);//removing <tr> from <table> element
}
                          

//remove completed tasks
function removeCompletedTasks()
{
    var table = document.getElementById("dataTable");
    var rowCount = table.rows.length;
    
    //loop through all rows of the table 
    for(var i=0;i<rowCount;i++)
    {
        //if the checkbox is checked, delete the row
        var row = table.rows[i];
        var chkbox = row.cells[0].childNodes[0]; //will return HTMLInputElement, which is of type checkbox
        if(null!= chkbox && true == chkbox.checked)
        {
            table.deleteRow(i);
            rowCount--;//decrement by 1
            i--;// so does our counter value
        }
    }
    
    //save the to-do list
    saveToDoList();
    alert("Completed Tasks Were Removed Successfully.");
}
                          
                          
//save the to-do list
function saveToDoList()
{
  var todoArray ={}; // an empty javascript object to store our text and state of the textBox(checked or unchecked)
  var checkBoxState =0; //initial it's false
  var textValue ="";  

  var table = document.getElementById("dataTable");

    if(table.rows.length)
    {
        //loop through all rows of the table
        for(var i=0;i<table.rows.length;i++)
        {
            var chkbox = table.rows[i].cells[0].childNodes[0];//getting the inputHTML element which is checkbox 
            if(null != chkbox && true == chkbox.checked)
            {
                checkBoxState =1; //change the state to 1
            }
            else
            {
                checkBoxState=0;
            }
            
            //retrieve the content of the to-do 
         textValue = table.rows[i].cells[1].childNodes[0].value;//getting the value out of textbox 
            
            //populate the array with object where property name is "row" +i. 
            todoArray["row"+i]={
                check:checkBoxState,
                text:textValue
            };
        }
          
    }
    else
    {
        todoArray=null;
    }

    //use the local storage API to persist the data as JSON
    window.localStorage.setItem("todoList",JSON.stringify(todoArray));
}
                          
//load the to-do list
function loadToDoList()
{
    //use the local storage API load the JSON formateted to-do list, and decode it
    var theList =JSON.parse(window.localStorage.getItem("todoList"));
    
    if(null==theList || theList =="null")
    {
       deleteAllRows();   
    }
    else
    {
        var count =0;
        for(var obj in theList)
        {
          count++;   
        }
        
        //remove any existing rows from the table
        deleteAllRows();
        
        //loop through the to-dos
        for(var i=0;i<count;i++)
        {
            //adding a row to the table for each one
            addTableRow(theList["row"+i],true);// true because to prevent user from being alerted as each row is loaded at startup
        }
    }
}

//delete all rows
function deleteAllRows()
{
    var table = document.getElementById("dataTable");
    var rowCount= table.rows.length;
    for(var i=0;i<rowCount;i++)
    {
        //delete the row
        table.deleteRow(i);
        rowCount--;
        i--;
    }
    
    //save the to-do list
    saveToDoList();
}
                          
                          
                          
                          
                          
                          
                          
                          
                          
                          
                          
                          
                          
                          