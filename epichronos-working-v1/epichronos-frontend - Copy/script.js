// STEP 1: Get the Analyze button
const analyzeBtn = document.getElementById("analyzeBtn");

// STEP 2: Run analysis on button click
analyzeBtn.addEventListener("click", function () {

    // ---- CHECK IF ALL INPUTS ARE EMPTY ----
    const inputs = document.querySelectorAll("input[type='number']");
    let hasAnyValue = false;

    inputs.forEach(input => {
        if (input.value !== "") hasAnyValue = true;
    });

    if (!hasAnyValue) {
        document.getElementById("pclf").innerText = "0.000";
        document.getElementById("gscore").innerText = "0.000";
        document.getElementById("fscore").innerText = "0.000";
        document.getElementById("riskText").innerText = "No Data Entered";
        return;
    }

    // ---- READ INPUT VALUES ----
    const age = Number(document.getElementById("age").value) || 0;
    const smoking = document.getElementById("smoking").checked;

    // cfDNA methylation markers
    const RASSF1A = Number(document.getElementById("RASSF1A").value) || 0;
    const SEPT9 = Number(document.getElementById("SEPT9").value) || 0;
    const APC = Number(document.getElementById("APC").value) || 0;
    const SFRP1 = Number(document.getElementById("SFRP1").value) || 0;
    const LINE1 = Number(document.getElementById("LINE1").value) || 0;

    // miRNA markers
    const miR21 = Number(document.getElementById("miR21").value) || 0;
    const miR34a = Number(document.getElementById("miR34a").value) || 0;
    const miR155 = Number(document.getElementById("miR155").value) || 0;
    const miR122 = Number(document.getElementById("miR122").value) || 0;

    // Epigenetic age markers
    const ELOVL2 = Number(document.getElementById("ELOVL2").value) || 0;
    const TRIM59 = Number(document.getElementById("TRIM59").value) || 0;

    // ---- INPUT VALIDATION ----
    const errorText = document.getElementById("errorText");
    errorText.innerText = "";
    // ---- AGE VALIDATION ----
    if (age < 1 || age > 190) {
        errorText.innerText = "Age must be between 1 and 190 years.";
        return;
    }
    // cfDNA & epigenetic markers: 0–100
    const percentMarkers = [RASSF1A, SEPT9, APC, SFRP1, LINE1, ELOVL2, TRIM59];
    for (let val of percentMarkers) {
        if (val < 0 || val > 100) {
            errorText.innerText = "Methylation and epigenetic values must be between 0 and 100%.";
            return;
        }
    }

    // miRNA fold change: 0.01–30
    const mirnaMarkers = [miR21, miR34a, miR155, miR122];
    for (let val of mirnaMarkers) {
        if (val < 0 || val > 30) {
            errorText.innerText = "miRNA fold-change values must be between 0 and 30.";
            return;
        }
    }

   fetch("http://127.0.0.1:8000/predict", {
    method: "POST",
    headers: {
        "Content-Type": "application/json"
    },
    body: JSON.stringify({
        patient: {
            age: age,
            sex: document.getElementById("sex").value,
            smoking: smoking
        },
        methylation: {
            RASSF1A: RASSF1A,
            SEPT9: SEPT9,
            APC: APC,
            SFRP1: SFRP1,
            LINE1: LINE1
        },
        mirna: {
            miR21: miR21,
            miR34a: miR34a,
            miR155: miR155,
            miR122: miR122
        },
        epigenetic: {
            ELOVL2: ELOVL2,
            TRIM59: TRIM59
        }
    })
})
.then(response => response.json())
.then(data => {
    document.getElementById("pclf").innerText = data.p_clf.toFixed(3);
    document.getElementById("gscore").innerText = data.g_score.toFixed(3);
    document.getElementById("fscore").innerText = data.final_score.toFixed(3);
    document.getElementById("riskText").innerText = data.risk_category;
})
.catch(error => {
    console.error(error);
    alert("Backend is not reachable. Is the server running?");
});

});