with open('city_life_ULTIMATE_COMPLETE_WORK_EVENTS_AUTO.html', 'r', encoding='utf-8') as f:
    lines = f.readlines()
    
    print("Scanning topics object...")
    balance = 0
    max_balance = 0
    max_line = 0
    
    for i in range(1341, 1410):  # From topics start to skillBasedDialogue
        opens = lines[i].count('{')
        closes = lines[i].count('}')
        prev_balance = balance
        balance += opens - closes
        
        if balance > max_balance:
            max_balance = balance
            max_line = i + 1
        
        # Print significant changes
        if abs(opens - closes) > 0:
            print(f"Line {i+1}: +{opens} -{closes} = {balance} (was {prev_balance})")
            print(f"  {lines[i].strip()[:80]}")
    
    print(f"\nMax balance reached: {max_balance} at line {max_line}")
    print(f"Final balance: {balance}")
