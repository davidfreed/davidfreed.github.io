document.getElementById('spendingForm').addEventListener('submit', function(event) {
    event.preventDefault(); // Prevent default form submission
    
    // Get user input values
    const rent = parseFloat(document.getElementById('Rent').value);
    const hotels = parseFloat(document.getElementById('Hotels').value);
    const flights = parseFloat(document.getElementById('Flights').value);
    const oth_travel = parseFloat(document.getElementById('TravelO').value);
    const food = parseFloat(document.getElementById('Food').value);
    const entertainment = parseFloat(document.getElementById('Entertainment').value);
    const gas = parseFloat(document.getElementById('Gas').value);
    const other = parseFloat(document.getElementById('Other').value);
    
    // Create main arrays, annualizing costs + moving returns to cents
    let categories = ['Rent', 'Hotels', 'Flights', 'TravelO', 'Food', 'Entertainment', 'Gas', 'Other']
    let first = math.multiply(12,[rent, hotels, flights, oth_travel, food, entertainment, gas, other])
    let inputs = math.diag(first)
    let ccpts = [
        [0.0, 5.0, 5.0, 1.0, 1.0, 1.0, 1.0, 1.0], // Amex-Plat
        [0.0, 1.0, 3.0, 1.0, 4.0, 1.0, 1.0, 1.0], // Amex-Gold
        [0.0, 15.0, 7.5, 4.5, 4.5, 1.5, 1.5, 1.5], // CSR
        [0.0, 7.5, 7.5, 2.25, 4.5, 2.25, 2.25, 2.25], // Chase FreeUnlim
        [0.0, 10.0, 5.0, 2.0, 2.0, 2.0, 2.0, 2.0], // VentureX
        [0.0, 3.5, 3.5, 3.5, 3.5, 2.62, 2.62, 2.62], // BoA Premier
        [0.0, 2.0, 2.0, 2.0, 4.0, 2.0, 4.0, 2.0], // Discover Secured
        [1.25, 2.5, 2.5, 2.5, 3.75, 1.25, 1.25, 1.25], // Bilt Elite
    ]
    let ccinfo2 = []
    let ccinfo3 = []

    // Stretch out inputs + multiply to get array of earnback values
    let ccpts_2 = math.multiply(ccpts, 0.01) 
    let eback = math.multiply(ccpts_2, inputs)

    let ccinfo = [ // Name, Net Cost  
        ['AmEx Platinum', 95, 'https://www.americanexpress.com/us/credit-cards/card/platinum/'],
        ['AmEx Gold', 150, 'https://card.americanexpress.com/d/cm/gold-card/'],
        ['Chase Sapphire Reserve', 250, 'https://creditcards.chase.com/rewards-credit-cards/sapphire/reserve'],
        ['Chase Freedom Unlimited', 0, 'https://creditcards.chase.com/cash-back-credit-cards/freedom/unlimited'],
        ['CapitalOne VentureX', 0, 'https://www.capitalone.com/credit-cards/venture-x/'],
        ['BoA Premier Rewards', 95, 'https://www.bankofamerica.com/preferred-rewards/increasing-preferred-rewards-with-credit-cards/'],
        ['Discover Secured', 0, 'https://www.discover.com/credit-cards/secured/'],
        ['Bilt Elite', 0, 'https://www.biltrewards.com/card'],
    ]
    for (let i = 0; i < ccinfo.length; i++) {
        profit = math.sum(... eback[i]) - ccinfo[i][1]
        ccinfo[i].push(profit)
    }

    // For each column, find the best value and corresponding card, assuming card independently good
    // If card is not independently viable, not worth considering (negative even if all spend on it)
    // Run the first time to see what incremental value cards have over the field
    let maxReturns = [];        
    for (let j = 0; j < eback[0].length; j++) {
        let maxReturn = 0;
        let maxCardIndex = -1;

        for (let i = 0; i < eback.length; i++) {
            if ((eback[i][j] > maxReturn) && (ccinfo[i][3] >= 0)) {
                maxReturn = eback[i][j];
                maxCardIndex = i;
            }
        }
        let bestCard = ""
        if (maxCardIndex > -1) { bestCard = ccinfo[maxCardIndex][0]}
        else { bestCard = "NA"}

        maxReturns.push([categories[j], maxReturn, maxCardIndex, bestCard])
    }    

    for (let i = 0; i < ccinfo.length; i++) {
        RewardVal = 0
        for (let j = 0; j < maxReturns.length; j++) {
            if (i === maxReturns[j][2]) {
                RewardVal = RewardVal + maxReturns[j][1]
            }
        }
        ccinfo2.push([ccinfo[i][0], ccinfo[i][1], RewardVal, RewardVal-ccinfo[i][1], ccinfo[i][2]])
    }
    console.log(ccinfo2)

    // Re-calculate the max returns after leaving out cards whose incremental profit is negative
    maxReturns2 = []
    for (let j = 0; j < eback[0].length; j++) {
        let maxReturn = 0;
        let maxCardIndex = -1;

        for (let i = 0; i < eback.length; i++) {
            if ((eback[i][j] > maxReturn) && (ccinfo2[i][3] >= 0)) {
                maxReturn = eback[i][j];
                maxCardIndex = i;
            }
        }

        let bestCard = ""
        if (maxCardIndex > -1) { bestCard = ccinfo2[maxCardIndex][0]}
        else { bestCard = "NA"}

        maxReturns2.push([categories[j], maxReturn, maxCardIndex, bestCard])
    }

    for (let i = 0; i < ccinfo2.length; i++) {
        RewardVal = 0
        for (let j = 0; j < maxReturns2.length; j++) {
            if (i === maxReturns2[j][2]) {
                RewardVal = RewardVal + maxReturns2[j][1]
            }
        }
        ccinfo3.push([ccinfo2[i][0], ccinfo2[i][1], RewardVal, RewardVal-ccinfo2[i][1], ccinfo2[i][4]])
    }
    console.log(ccinfo3)

    // Calculate total savings, % back 
    TotalRewards = 0
    RewardsCards = []
    for (let i=0; i < ccinfo3.length; i++) {
        if(ccinfo3[i][3] > 0) {
            TotalRewards += ccinfo3[i][3]
            RewardsCards.push([ccinfo3[i][0], ccinfo3[i][4]])
        }    
    }
    PercSaved = (100.0 * TotalRewards) / math.sum(first)
    console.log(RewardsCards)

    // Example display of results (replace with your own)
    const resultContainer = document.getElementById('creditCardList');
    resultContainer.innerHTML = 
        `<p>Annual Savings: $${TotalRewards.toFixed(2)}</p>
         <p>Total Percent Back: ${PercSaved.toFixed(2)}% </p>`;

    // Function that generates a table with the recommended credit cards
    function CardTable(cards) {
        let tableHTML = '<table><tr><th>Credit Card</th><th>Apply Link</th></tr>';
        cards.forEach(card => {
            tableHTML += `<tr><td>${card[0]}</td><td><a href="${card[1]}" target="_blank">Apply Now</a></td></tr>`;
        });
        tableHTML += '</table>';
        return tableHTML;
    } 

    // Function to generate a table with a list of categories and which card to use
    function CardCat(cards) {
        let tableHTML = '<table><tr><th>Category</th><th>Credit Card</th></tr>';
        cards.forEach(card => {
            tableHTML += `<tr><td>${card[0]}</td><td>${card[3]}</a></td></tr>`;
        });
        tableHTML += '</table>';
        return tableHTML;
    }

    resultContainer.innerHTML += `${CardTable(RewardsCards)}`;
    resultContainer.innerHTML += `${CardCat(maxReturns2)}`;

});