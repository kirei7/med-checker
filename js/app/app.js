var appData;
var selectedSymptoms = [];
var selectedBodyPart;

$(document).ready(function () {
    $.get(
        "js/app/data.json",
        function (data) {
            appData = data;
            initApp();
        },
        "json"
    );
});

function initApp() {
    //renderBodyParts();
    decorateSvgLinks();
    initOnClickHandlers();
    initGenderChange();
}

/*function renderBodyParts() {
    for (bodyPart in appData) {
        let item = cloneItem("bodyPart-clone");
        item.find("button").attr("data-id", bodyPart);
        item.find("button").text(appData[bodyPart].bodyPartName);
        $(".bodyParts").append(item);
    }
}*/
function decorateSvgLinks() {
    $.each($(".bodyParts a").toArray(), function (i, v) {
        let link = $(v).attr("xlink:href").substr(1);
        $(v).addClass("bodyPart-navigator");
        $(v).attr("data-id", link);
    });
}

function initOnClickHandlers() {
    let inListClass = "in-list";
    //select body part
    $(".bodyPart-navigator").click(function () {
        let id = $(this).attr("data-id");
        selectedBodyPart = id;
        renderSymptoms(id);
    });
    //add symptom to list
    $(".symptoms-available").on('click', '.symptom-item-wrapper', function () {
        let parent = $(this).parents(".symptom-item");
        let newItem = parent.clone();
        parent.remove();
        newItem.addClass(inListClass);
        $(".symptoms-selected").append(newItem);
        selectedSymptoms.push(newItem.attr("data-id"));
        resetResults();
    });
    //remove symptom from list
    $(".symptoms-selected").on('click', '.remove-item-from-list', function () {
        let parent = $(this).parents(".symptom-item");
        let newItem = parent.clone();
        parent.remove();
        newItem.removeClass(inListClass);
        $(".symptoms-available").append(newItem);
        var index = selectedSymptoms.indexOf(newItem.attr("data-id"));
        if (index > -1) {
            selectedSymptoms.splice(index, 1);
        }
        resetResults();
    });
}

function renderSymptoms(id) {
    resetState();
    let symptoms = appData[id].bodyPartSymptoms;
    for (let i = 0; i < symptoms.length; i++) {
        let item = cloneItem("symptom-item");
        item.find("span").text(symptoms[i]);
        item.attr("data-id", symptoms[i]);
        $(".symptoms-available").append(item);
    }
}

function resetResults() {
    $(".results-container").empty();
    let diseases = appData[selectedBodyPart].diseases;
    for (let i = 0; i < diseases.length; i++) {
        let disease = diseases[i];
        let resultItem = {};
        resultItem.name  = disease.name;
        resultItem.actualCount = calculatePercentage(disease.symptoms);

        renderResult(resultItem);
    }

}
function calculatePercentage(diseaseSymptoms) {
    let counter = 0;
    for (let i = 0; i < diseaseSymptoms.length; i++) {
        let index = selectedSymptoms.indexOf(diseaseSymptoms[i]);
        if (index > -1) {
            counter++;
        }
    }
    return (100 * counter) / diseaseSymptoms.length;
}
function renderResult(resultItem) {
    let count = Math.round(resultItem.actualCount);
    if (count === 0) return;
    let newItem = cloneItem("result-clone");
    newItem.find(".result-name").text(resultItem.name);
    newItem.find(".result-percentage").text(count + "%");
    $(".results-container").append(newItem);
}

function resetState() {
    $(".symptoms-available").empty();
    $(".symptoms-selected").empty();
    $(".results-container").empty();
}
function resetAll() {
    resetState();
    var selectedSymptoms = [];
    var selectedBodyPart = null;
}

function cloneItem(itemClass) {
    return $("#clone-container ." + itemClass).clone();
}

function initGenderChange() {
    $(".gender-toggler input").on('change', function () {
        resetState();
        let id = $(".gender-toggler input:checked").attr("id");
        if (id === "toggle-male") {
            $(".svg-female").removeClass("active");
            $(".svg-male").addClass("active");
        } else {
            $(".svg-female").addClass("active");
            $(".svg-male").removeClass("active");
        }
    });
}