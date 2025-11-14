with open('city_life_ULTIMATE_COMPLETE_WORK_EVENTS_AUTO.html', 'r', encoding='utf-8') as f:
    lines = f.readlines()
    
    print("Detailed check of ENHANCED_DIALOGUE_SYSTEM structure...")
    balance = 0
    for i in range(1340, 1412):
        opens = lines[i].count('{')
        closes = lines[i].count('}')
        balance += opens - closes
        
        if i in [1340, 1341, 1342, 1399, 1405, 1406, 1407, 1408, 1409, 1410]:
            print(f"Line {i+1}: +{opens} -{closes} = {balance}")
            print(f"  {lines[i].strip()[:90]}")
