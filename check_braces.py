with open('city_life_ULTIMATE_COMPLETE_WORK_EVENTS_AUTO.html', 'r', encoding='utf-8') as f:
    lines = f.readlines()
    balance = 0
    prev_balance = 0
    
    for i, line in enumerate(lines, 1):
        opens = line.count('{')
        closes = line.count('}')
        prev_balance = balance
        balance += opens - closes
        
        # Find where balance becomes 1 and stays for a while
        if prev_balance == 0 and balance == 1 and i < 10340:
            print(f"Line {i}: Balance goes from 0 to 1")
            print(f"  {line.strip()[:100]}")
            # Check if it stays at 1 for next 50 lines
            check_lines = min(50, len(lines) - i)
            temp_balance = balance
            stayed = True
            for j in range(i, min(i + check_lines, len(lines))):
                temp_balance += lines[j].count('{') - lines[j].count('}')
                if temp_balance == 0:
                    stayed = False
                    break
            if stayed:
                print(f"  -> Balance stays >= 1 for at least {check_lines} lines!")
    
    print(f"\nFinal balance: {balance}")
