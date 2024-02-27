---
layout: default
title: home
---

Gaming the credit card points system is a lucrative Internet subculture. I found it a hard one to crack. Every tool and blog seemed geared to the people who drew psychic pleasure from the game. I wanted to max my $$ and min my effort. Just the most cash back on run-rate spend (excluding free amenities I wouldn't have paid for, e.g.). Convinced this was a solvable math problem, I built a simple model to tell me the exact cards I needed and what I could save. I calculated ~4% savings on my total spend playing optimally. At a 20% savings rate, it was the same as getting a 3.2% raise! The tool below is to help everyone realize similar savings. There are direct links to apply for the credit cards for convenience, but I get no referral fee. This is for anyone solving for maximum cash back while thinking about it as little as possible. Only the yellow cells are editable right now. 

----------------------------------------------------------------------------------

<div class = "app-container">
    <div class = "form-container">
        <h2> Enter In Your Expenses </h2>
            <form id="spendingForm">
            <!--<div class="form-group">
                <label for="cs">Credit Score:</label>
                <input type="number" id="cs" name="cs">
            </div> -->
            {% for item in site.data.spend %}
                <div class = "form-group">
                    <label for = {{item.name}}> Monthly spend on {{item.name}}: </label>
                    <input type="number" id={{item.name}} name={{item.name}} value=100>
                </div>
            {% endfor %}
            <button type="submit">Submit</button>
        </form>
    </div>
    <div class="result-container">
        <h2>Recommended Credit Cards</h2>
        <!-- <p>Look at me, I'm a recommendation!</p> -->
        <div id="creditCardList"></div>
    </div>
</div>

<script src="script.js"></script>
<script src="https://cdnjs.cloudflare.com/ajax/libs/mathjs/9.4.4/math.js"></script>
