class Koers {
    constructor(muntsoort, muntcode, tarief_vreemde_valuta, tarief_euro) {
        this.muntsoort = muntsoort
        this.muntcode = muntcode
        this.tarief_vreemde_valuta = tarief_vreemde_valuta
        this.tarief_euro = tarief_euro
    }
}

async function fetch_wisselkoersen(year, month) {
    // Fetch data through proxy so we avoid requiring CORS
    const url = "data/douane_wisselkoersen/wks.douane.wisselkoersen.dd" + year + month + ".xml";
    const req = await fetch(url)

    if (req.status !== 200) {
        return []
    }

    const text = await req.text()

    const parser = new DOMParser();
    const xml_doc = parser.parseFromString(text, "text/xml")

    const publiceren_koersen = xml_doc.getElementsByTagName("publicerenKoersen")[0]
    const koersen = publiceren_koersen.getElementsByTagName("douaneMaandwisselkoers")

    const koersen_parsed = []

    for (const koers of koersen) {
        function get(name) {
            return koers.getElementsByTagName(name)[0].childNodes[0].nodeValue
        }

        const muntcode = get("muntCode")
        const muntsoort = get("muntSoort")
        const tarief_vreemde_valuta = get("tariefInVreemdeValuta").replace(",", ".")
        const tarief_euro = get("tariefInEuro").replace(",", ".")

        koersen_parsed.push(new Koers(muntsoort, muntcode, tarief_vreemde_valuta, tarief_euro))
    }

    koersen_parsed.sort((a, b) => a.muntsoort.localeCompare(b.muntsoort))

    return koersen_parsed
}

const year_elem = document.querySelector("#year")
const currency_elem = document.querySelector("#currency")
const table_elem = document.querySelector("#table-contents")
const warning_span = document.querySelector("#warning")

const max = 22;
for (const num of Array(max).keys()) {
    const option = document.createElement("option")
    option.value = (max - num) + 2000
    option.textContent = (max - num) + 2000
    year_elem.appendChild(option)
}

year_elem.onchange = () => {
    update_calculator()
}

async function update_calculator() {
    const year = year_elem.value
    const koersen = await fetch_wisselkoersen(year, "01")

    while (currency_elem.firstChild) {
        currency_elem.removeChild(currency_elem.firstChild)
    }

    const option = document.createElement("option")
    option.value = "none"
    option.textContent = "Selecteer valuta"
    currency_elem.appendChild(option)

    if (koersen.length === 0) {
        currency_elem.hidden = true
        warning_span.textContent = "Koersen voor dit jaar zijn (nog) niet beschikbaar"
    } else {
        currency_elem.hidden = false
        warning_span.textContent = ""
        for (const koers of koersen) {
            const option = document.createElement("option")
            option.value = koers.muntcode
            option.textContent = koers.muntsoort
            currency_elem.appendChild(option)
        }
    }

    await update_table()
}

async function update_table() {
    const year = year_elem.value

    while (table_elem.firstChild) {
        table_elem.removeChild(table_elem.firstChild)
    }

    const message = document.createElement("div")
    message.classList = "table-column five"
    table_elem.appendChild(message)

    if (currency_elem.value === "none") {
        message.textContent = "Geen valuta geselecteerd"
        return
    }

    message.textContent = "Data aan het laden..."

    const total = document.createElement("div")
    total.classList = "table-row"

    const three = document.createElement("div")
    three.classList = "table-column three"
    three.textContent = "Totaal"
    total.appendChild(three)

    const total_foreign_elem = document.createElement("div")
    total_foreign_elem.classList = "table-column"
    total_foreign_elem.textContent = "Foreign"
    total.appendChild(total_foreign_elem)

    const total_euro_elem = document.createElement("div")
    total_euro_elem.classList = "table-column"
    total_euro_elem.textContent = "Euro"
    total.appendChild(total_euro_elem)

    const foreign_elems = []
    const euro_elems = []

    function update_totals() {
        let total_foreign = 0
        let total_euro = 0

        for (const foreign of foreign_elems) {
            total_foreign += parseFloat(foreign.value)
        }

        for (const euro of euro_elems) {
            total_euro += parseFloat(euro.value)
        }

        total_foreign_elem.textContent = total_foreign.toFixed(8)
        total_euro_elem.textContent = total_euro.toFixed(8)
    }

    const elements = await Promise.all(["01", "02", "03", "04", "05", "06", "07", "08", "09", "10", "11", "12"].map(month =>
        fetch_wisselkoersen(year, month).then(koersen => {
            if (koersen.length === 0) {
                return undefined;
            }

            const entry = document.createElement("div")
            entry.classList = "table-row"

            const month_elem = document.createElement("div")
            month_elem.classList = "table-column"
            entry.appendChild(month_elem)

            const foreign_currency = document.createElement("div")
            foreign_currency.classList = "table-column"
            entry.appendChild(foreign_currency)

            const euro = document.createElement("div")
            euro.classList = "table-column"
            entry.appendChild(euro)

            const foreign_currency_value_col = document.createElement("div")
            foreign_currency_value_col.classList = "table-column"
            entry.appendChild(foreign_currency_value_col)

            const foreign_value_input = document.createElement("input")
            foreign_value_input.type = "number"
            foreign_value_input.step = 0.01
            foreign_currency_value_col.appendChild(foreign_value_input)

            const euro_value_col = document.createElement("div")
            euro_value_col.classList = "table-column"
            entry.appendChild(euro_value_col)

            const euro_value_input = document.createElement("input")
            euro_value_input.type = "number"
            euro_value_input.step = 0.01
            euro_value_col.appendChild(euro_value_input)

            let month_text = "Error"
            if (month === "01") {
                month_text = "Januari"
            } else if (month === "02") {
                month_text = "Februari"
            } else if (month === "03") {
                month_text = "Maart"
            } else if (month === "04") {
                month_text = "April"
            } else if (month === "05") {
                month_text = "Mei"
            } else if (month === "06") {
                month_text = "Juni"
            } else if (month === "07") {
                month_text = "Juli"
            } else if (month === "08") {
                month_text = "Augustus"
            } else if (month === "09") {
                month_text = "September"
            } else if (month === "10") {
                month_text = "Oktober"
            } else if (month === "11") {
                month_text = "November"
            } else if (month === "12") {
                month_text = "December"
            }
            month_elem.textContent = month_text

            let koers = undefined
            for (const koers_iter of koersen) {
                if (koers_iter.muntcode == currency_elem.value) {
                    foreign_currency.textContent = koers_iter.tarief_vreemde_valuta
                    euro.textContent = koers_iter.tarief_euro
                    koers = koers_iter
                }
            }

            foreign_value_input.value = 0
            foreign_elems.push(foreign_value_input)
            euro_value_input.value = 0
            euro_elems.push(euro_value_input)

            foreign_value_input.oninput = () => {
                euro_value_input.value = (foreign_value_input.value * koers.tarief_euro).toFixed(8)
                update_totals()
            }

            euro_value_input.oninput = () => {
                foreign_value_input.value = (euro_value_input.value * koers.tarief_vreemde_valuta).toFixed(8)
                update_totals()
            }

            entry.month = parseInt(month)
            return entry
        })
    ))

    table_elem.removeChild(message)

    elements.sort((a, b) => a.month > b.month)
    for (const elem of elements) {
        if (elem) {
            table_elem.appendChild(elem)
        }
    }

    update_totals()

    table_elem.appendChild(total)

}

currency_elem.onchange = () => {
    update_table()
}

update_calculator()
