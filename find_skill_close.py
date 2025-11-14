with open('city_life_ULTIMATE_COMPLETE_WORK_EVENTS_AUTO.html', 'r', encoding='utf-8') as f:
    lines = f.readlines()
    
    print("Scanning ENHANCED_DIALOGUE_SYSTEM properties...")
    balance = 1  # Starting AFTER line 1341 (ENHANCED_DIALOGUE_SYSTEM opening)
    
    for i in range(1341, 1600):
        opens = lines[i].count('{')
        closes = lines[i].count('}')
        prev_balance = balance
        balance += opens - closes
        
        # Print key lines
        if i in [1341, 1407, 1408, 1453, 1454, 1494, 1495, 1496, 1525, 1526, 1527, 1596, 1597]:
            print(f"Line {i+1}: +{opens} -{closes} = {balance}")
            print(f"  {lines[i].strip()[:90]}")
    
    print(f"\nFinal balance: {balance}")
