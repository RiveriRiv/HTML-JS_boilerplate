import './style.css';

document.getElementById("add").addEventListener("click", addToOpenList);
document.getElementById("search").addEventListener("input", search);
document.getElementById("sortOpen").addEventListener("change", loadEvent);
document.getElementById("sortDone").addEventListener("change", loadEvent);
document.getElementById("clearOpenList").addEventListener("click", clearOpenList);
document.getElementById("clearDoneList").addEventListener("click", clearDoneList);

window.addEventListener("load", load);



function load() {
	loadOpenList();
	loadDoneList();
}

 function loadOpenList() {
	var openList = JSON.parse(localStorage.getItem("openList"));

	if (openList === null) {return;}

	let open = document.getElementById('open')

	while (open.firstChild) {
		open.removeChild(open.lastChild);
	}

	sortOpenList(openList);

	localStorage.setItem("openList", JSON.stringify(openList));

	for (let i = 0; i < openList.length; i++) {
		let li = document.createElement("li");
		let id = "open" + i
		li.innerHTML = "<input type='checkbox' id='" + id + "' value='" + openList[i].taskValue + "'><input type='text' value ='" + openList[i].taskValue +"'><div class='dates'>"  + openList[i].creationDate + "</div>"
		open.append(li);

		li.firstChild.addEventListener("click", addToDoneList);
		li.addEventListener("mouseenter", addDeleteButton);
		li.addEventListener("mouseleave", removeDeleteButton);
		li.children[1].addEventListener("focusout", changeOpenValue);
	}
 }

 function sortOpenList(openList) {
	if (document.getElementById('sortOpen').selectedIndex === 0) {
		openList.sort(compareByCreationDate)
	} else if (document.getElementById('sortOpen').selectedIndex === 1) {
		openList.sort(inverseCompareByCreationDate)
	} else if (document.getElementById('sortOpen').selectedIndex === 2) {
		openList.sort(compareByTaskValue)
	} else if (document.getElementById('sortOpen').selectedIndex === 3) {
		openList.sort(inverseCompareByTaskValue)
	}
 }

 function loadDoneList() {
	var doneList = JSON.parse(localStorage.getItem("doneList"));

	if (doneList === null) {return;}

	let done = document.getElementById('done');

	while (done.firstChild) {
		done.removeChild(done.lastChild);
	}

	sortDoneList(doneList)

	localStorage.setItem("doneList", JSON.stringify(doneList));

	for (let i = 0; i < doneList.length; i++) {
		let li = document.createElement("li");
		let id = "done" + i
		li.innerHTML = "<input type='checkbox' id='" + id + "' value='" + doneList[i].taskValue + "' checked><input type='text' value='" + doneList[i].taskValue + "'><div class='dates'>" + doneList[i].creationDate + "</br>" + doneList[i].dueDate + "</div>"
		done.append(li);

		li.firstChild.addEventListener("click", addToOpenListFromDoneList);
		li.addEventListener("mouseenter", addDeleteButton);
		li.addEventListener("mouseleave", removeDeleteButton);
		li.children[1].addEventListener("focusout", changeDoneValue);
	}
 }

 function sortDoneList(doneList) {
	if (document.getElementById('sortDone').selectedIndex === 0) {
		doneList.sort(compareByDueDate)
	} else if (document.getElementById('sortDone').selectedIndex === 1) {
		doneList.sort(inverseCompareByDueDate)
	} else if (document.getElementById('sortDone').selectedIndex === 2) {
		doneList.sort(compareByTaskValue)
	} else if (document.getElementById('sortDone').selectedIndex === 3) {
		doneList.sort(inverseCompareByTaskValue)
	}
 }

 function changeOpenValue() {
     changeValue("openList", "open");
 }

 function changeDoneValue() {
     changeValue("doneList", "done");
 }

 function changeValue(listKey, listId) {
     let list = JSON.parse(localStorage.getItem(listKey));
	 let id = event.target.parentNode.firstChild.id.replace(listId, "")
	 list[id].taskValue = event.target.value
	 localStorage.setItem(listKey, JSON.stringify(list));

	 window.dispatchEvent(new Event('load'));
  }

 function addToOpenList() {
	let task = document.getElementById('task');

	let openList = JSON.parse(localStorage.getItem("openList"));

	 if (openList === null) {
		 openList = [];
	 }

	openList.push(
		{
			"taskValue" : task.value,
			"creationDate" : formatDate(new Date())
		}
	);

	localStorage.setItem("openList", JSON.stringify(openList));
 }

 function addToDoneList() {
	let doneList = JSON.parse(localStorage.getItem("doneList"));

	 if (doneList === null) {
		 doneList = [];
	 }

	 doneList.push(
		{
			"taskValue" : event.target.value,
			"creationDate" : event.target.parentNode.children[2].textContent,
			"dueDate" : formatDate(new Date())
		}
	);

	 localStorage.setItem("doneList", JSON.stringify(doneList));
	  
	  var openList = JSON.parse(localStorage.getItem("openList"));
	 let id = event.target.id.replace("open", "")
	 openList.splice(id, 1)
	 localStorage.setItem("openList", JSON.stringify(openList));
	 event.target.parentNode.remove();

	window.dispatchEvent(new Event('load'));
 }

 function addToOpenListFromDoneList() {
	let openList = JSON.parse(localStorage.getItem("openList"));

	 if (openList === null) {
		 openList = [];
	 }

	 openList.push(
	{
		"taskValue" : event.target.value,
		"creationDate" : formatDate(new Date())
	}
	);

	 localStorage.setItem("openList", JSON.stringify(openList));
	  
	  var doneList = JSON.parse(localStorage.getItem("doneList"));
	 let id = event.target.id.replace("done", "")
	 doneList.splice(id, 1)
	 localStorage.setItem("doneList", JSON.stringify(doneList));
	 event.target.parentNode.remove();

	window.dispatchEvent(new Event('load'));
 }

 function search() {
	let listValues = document.querySelectorAll("li")

	for (let listValue of listValues) {
		if (listValue.firstChild.value.startsWith(this.value)) {
			listValue.style.display = null
		} else {
			listValue.style.display = 'none'
		}
	}
 }

 function loadEvent() {
	window.dispatchEvent(new Event('load'));
 }

 function formatDate(date) {
    let hours = date.getHours();
    let minutes = date.getMinutes();
    let ampm = hours > 12 ? "PM" : "AM"; 
	let formattedMinutes = minutes > 9 ? minutes : "0" + minutes

	return hours + ":" + formattedMinutes + " " + ampm;
 }

 function compareByTaskValue(a, b) {
	return compare(a.taskValue, b.taskValue)
 }

 function inverseCompareByTaskValue(a,b) {
	return compare(a.taskValue, b.taskValue) * -1;
 }

 function compareByCreationDate(a, b) {
	return compare(a.creationDate, b.creationDate)
 }

 function inverseCompareByCreationDate(a,b) {
	return compare(a.creationDate, b.creationDate) * -1;
 }

 function compareByDueDate(a, b) {
	return compare(a.dueDate, b.dueDate)
 }

 function inverseCompareByDueDate(a,b) {
	return compare(a.dueDate, b.dueDate) * -1;
 }

 function compare(a, b) {
	let comparison = 0;
	if (a > b) {
		comparison = 1;
	} else if (a < b) {
		comparison = -1;
	}

	return comparison;
 }

 function addDeleteButton() {
	let button = document.createElement("button");
    button.innerText = "🗑";
	event.target.append(button);

	button.addEventListener("click", deleteRow);
 }

 function deleteRow() {
	let input = event.target.parentNode.firstChild

	if (input.id.startsWith("open")) {
	var openList = JSON.parse(localStorage.getItem("openList"));
		let id = event.target.id.replace("open", "")
		openList.splice(id, 1)
		localStorage.setItem("openList", JSON.stringify(openList));

		event.target.parentNode.remove();
	} else if (input.id.startsWith("done")) {
		var doneList = JSON.parse(localStorage.getItem("doneList"));
		let id = event.target.id.replace("done", "")
		doneList.splice(id, 1)
		localStorage.setItem("doneList", JSON.stringify(doneList));

		event.target.parentNode.remove();
	}
 }

 function removeDeleteButton() {
	event.target.lastChild.remove()
 }

 function clearOpenList() {
	clearList("openList", "open");
 }

 function clearDoneList() {
	clearList("doneList", "done");
 }

 function clearList(listKey, listId) {
	localStorage.removeItem(listKey);
	window.dispatchEvent(new Event('load'));

	Array.from(document.getElementById(listId).children).forEach(child => child.remove());
 }