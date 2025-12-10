const TABLE_SIZE = 101;
const table = Array.from({ length: TABLE_SIZE }, () => []);

function hashKey(text) {
    let h = 0;
    for (let i = 0; i < text.length; i++) {
        h = (h + text.charCodeAt(i)) % TABLE_SIZE;
    }
    return h;
}

function storeArtifact(artifact) {
    const key = artifact.name.toLowerCase();
    const index = hashKey(key);
    const bucket = table[index];
    const existingIndex = bucket.findIndex(entry => entry.key === key);
    if (existingIndex >= 0) {
        bucket[existingIndex].value = artifact;
    } else {
        bucket.push({ key, value: artifact });
    }
}

function findArtifact(name) {
    const key = name.toLowerCase();
    const index = hashKey(key);
    return table[index].find(e => e.key === key)?.value || null;
}

function deleteArtifactByName(name) {
    const key = name.toLowerCase();
    const bucket = table[hashKey(key)];
    const idx = bucket.findIndex(e => e.key === key);
    if (idx >= 0) {
        bucket.splice(idx, 1);
        return true;
    }
    return false;
}

function getAllArtifacts() {
    return table.flat().map(entry => entry.value);
}

const rarityOrder = { Common: 1, Uncommon: 2, Rare: 3, Epic: 4, Legendary: 5 };

function sortByName(list) {
    return list.sort((a, b) => a.name.localeCompare(b.name));
}

function getMessage(id, text, show = true) {
    const msg = document.getElementById(id);
    msg.style.background = "rgba(0,0,0,0.75)";
    msg.style.color = "white";
    msg.style.textAlign = "center";
    msg.style.margin = "10px auto";
    msg.style.width = "60%";

    if (show) {
        msg.style.display = "block";
        msg.textContent = text;
    } else {
        msg.style.display = "none";
        msg.textContent = "";
    }
}

function renderVault(list) {
    const vault = document.getElementById("vaultDisplay");
    vault.innerHTML = list?.length ? list.map(a => 
        `<div class="artifact-item">${a.name} | Type: ${a.type} | Rarity: ${a.rarity} | Power: ${a.power}</div>`
    ).join("") : "The vault is empty.";
}

function addArtifact() {
    const [name, type, rarity, power] = ["artifactName", "artifactType", "artifactRarity", "artifactPower"].map(id => document.getElementById(id).value.trim());
    const powerRating = parseInt(power, 10);

    getMessage("addMessage", "", false);
    
    if (!name || !type || !rarity || !power || isNaN(powerRating) || powerRating < 1 || powerRating > 100) {
        getMessage("addMessage", !name || !type || !rarity || !power ? "Please fill in all fields." : "Power must be 1-100.");
        return;
    }

    if (findArtifact(name)) {
        getMessage("addMessage", "Artifact already exists.");
        return;
    }

    storeArtifact({ name, type, rarity, power: powerRating });
    getMessage("addMessage", "Artifact added.");
    
    ["artifactName", "artifactType", "artifactRarity", "artifactPower"].forEach(id => document.getElementById(id).value = "");
    renderVault(sortByName(getAllArtifacts()));
}

function searchArtifact() {
    const name = document.getElementById("searchName").value.trim();
    getMessage("searchResult", "", false);
    
    if (!name) {
        getMessage("searchResult", "Enter a name to search.");
        return;
    }
    
    const artifact = findArtifact(name);
    getMessage("searchResult", artifact ? `Found: ${artifact.name} | Type: ${artifact.type} | Rarity: ${artifact.rarity} | Power: ${artifact.power}` : "Not found.");
}

function removeArtifact() {
    const name = document.getElementById("removeName").value.trim();
    getMessage("removeMessage", "", false);
    
    if (!name) {
        getMessage("removeMessage", "Enter a name to remove.");
        return;
    }
    
    if (deleteArtifactByName(name)) {
        getMessage("removeMessage", "Artifact removed.");
        document.getElementById("removeName").value = "";
        renderVault(sortByName(getAllArtifacts()));
    } else {
        getMessage("removeMessage", "Not found.");
    }
}

window.onload = () => renderVault(sortByName(getAllArtifacts()));
