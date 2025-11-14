with open('city_life_ULTIMATE_COMPLETE_WORK_EVENTS_AUTO.html', 'r', encoding='utf-8') as f:
    lines = f.readlines()
    
    print("Searching for unclosed blocks in getJobInterviewOptions()...")
    balance = 1
    unclosed_blocks = [('function getJobInterviewOptions', 8397)]
    
    for i in range(8397, 8686):
        line = lines[i].strip()
        opens = lines[i].count('{')
        closes = lines[i].count('}')
        
        # Track opening blocks
        for _ in range(opens):
            # Extract block type (if/for/etc)
            if 'if (' in line:
                unclosed_blocks.append(('if', i+1))
            elif 'for (' in line:
                unclosed_blocks.append(('for', i+1))
            elif 'while (' in line:
                unclosed_blocks.append(('while', i+1))
            else:
                unclosed_blocks.append(('block', i+1))
        
        # Track closing blocks
        for _ in range(closes):
            if len(unclosed_blocks) > 1:  # Keep function opening
                unclosed_blocks.pop()
        
        balance += opens - closes
    
    print(f"\nUnclosed blocks remaining:")
    for block_type, line_num in unclosed_blocks:
        print(f"  Line {line_num}: {block_type}")
        if line_num - 1 < len(lines):
            print(f"    {lines[line_num-1].strip()[:80]}")
    
    print(f"\nFinal balance: {balance}")
    print(f"Number of unclosed blocks: {len(unclosed_blocks)}")
