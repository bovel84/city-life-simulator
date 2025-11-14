with open('city_life_ULTIMATE_COMPLETE_WORK_EVENTS_AUTO.html', 'r', encoding='utf-8') as f:
    lines = f.readlines()
    
    print("Finding where balance becomes 1 and stays...")
    balance = 1
    
    for i in range(8397, 8687):
        opens = lines[i].count('{')
        closes = lines[i].count('}')
        prev_balance = balance
        balance += opens - closes
        
        # When balance drops to 1, it should mean we're back to just the function opening
        # Track when it drops to 1
        if prev_balance > 1 and balance == 1:
            print(f"Line {i+1}: Balance drops to 1 (should be back to function level)")
            print(f"  {lines[i].strip()[:80]}")
            # Check if balance stays at 1 for next lines
            stayed = True
            for j in range(i+1, min(i+10, 8686)):
                temp_opens = lines[j].count('{')
                temp_closes = lines[j].count('}')
                temp_balance = balance + temp_opens - temp_closes
                if temp_balance != balance and temp_opens + temp_closes > 0:
                    stayed = False
                    break
                balance = temp_balance
            if stayed:
                print(f"  -> Balance stable at 1, this might be where inner blocks close")
                print(f"Next non-empty lines:")
                for j in range(i+1, min(i+5, len(lines))):
                    if lines[j].strip():
                        print(f"  Line {j+1}: {lines[j].strip()[:70]}")
            balance = prev_balance + opens - closes  # Reset for continue scanning
