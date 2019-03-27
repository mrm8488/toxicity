let model, labels;

const classify = async (inputs) => {
    const results = await model.classify(inputs);
    return inputs.map((d, i) => {
        const obj = {
            'text': d
        };
        results.forEach((classification) => {
            obj[classification.label] = classification.results[i].match;
        });
        return obj;
    });
};

const predict = async (text) => {
    model = await toxicity.load();

    labels = model.model.outputNodes.map(d => d.split('/')[0]);

    const predictions = await classify([text]);
    console.log(predictions[0]);
    return predictions[0];
}

const evaluatePrediction = (p) => {
    if (p === true) return `<p class="text-danger"><strong>positive</strong></p>"`;
    if (p === false) return `<p class="text-success">negative</p>`;
    return "null";
}



const addPredictionToTable = (prediction) => {
    document.getElementById("cell-text").innerHTML = prediction.text;
    document.getElementById("cell-identity-attack").innerHTML = evaluatePrediction(prediction
        .identity_attack);
    document.getElementById("cell-insult").innerHTML = evaluatePrediction(prediction.insult);
    document.getElementById("cell-obscene").innerHTML = evaluatePrediction(prediction.obscene);
    document.getElementById("cell-severe-toxicity").innerHTML = evaluatePrediction(prediction
        .severe_toxicity);
    document.getElementById("cell-sexual-explicit").innerHTML = evaluatePrediction(prediction
        .sexual_explicit);
    document.getElementById("cell-threat").innerHTML = evaluatePrediction(prediction.threat);
    document.getElementById("cell-toxicity").innerHTML = evaluatePrediction(prediction.toxicity);

}

$(function () {
    $('#formToxicity').on("submit", async function (e) {
        e.preventDefault(); // cancel the actual submit
        const text = document.getElementById("text").value;

        if (text !== "") {
            document.getElementById("btn-submit").className = "invisible";
            document.getElementById("btn-loading").className = "btn btn-primary";
            document.getElementById("table").className = "invisible";
            prediction = await predict(text);
            addPredictionToTable(prediction);
            document.getElementById("table").className = "table";
            document.getElementById("btn-submit").className = "btn btn-primary";
            document.getElementById("btn-loading").className = "invisible";

        }

    });
});