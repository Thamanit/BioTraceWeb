def calculate_diabetes_risk(fingers, gender, age):
    """
    คำนวณความเสี่ยงเป็นโรคเบาหวานชนิดที่ 2 จากลายนิ้วมือ + อายุ + เพศ
    
    fingers: dictionary of 10 นิ้ว ('R1'-'R5', 'L1'-'L5') ใช้ 'W' สำหรับ Whorl
    gender: 'M' หรือ 'F'
    age: อายุ (ปี)
    """
    # Step 1: Whorl Score
    whorl_score = sum(1 for v in fingers.values() if v.upper() == 'W')
    whorl_percent = (whorl_score / 10) * 100

    # Step 2: ความเสี่ยงพื้นฐานตามเพศและอายุ
    base_risk = None
    if gender.upper() == 'F':
        if 45 <= age < 65:
            base_risk = 13.7
        elif age >= 65:
            base_risk = 26.0
    elif gender.upper() == 'M':
        if 45 <= age < 65:
            base_risk = 18.0
        elif age >= 65:
            base_risk = 29.2

    # Step 3: รวม Whorl risk + base risk
    if base_risk is not None:
        total_risk = base_risk + (whorl_percent * 0.5)  # 0.5 คือถ่วงน้ำหนักเบาให้ลายนิ้วมือ
    else:
        total_risk = None

    # Step 4: แสดงผล
    print("📌 ผลลัพธ์:")
    print(f"Whorl Score = {whorl_score}")
    print(f"เปอร์เซ็นต์ลายนิ้วมือแบบ Whorl = {whorl_percent:.1f}%")
    
    if base_risk is not None:
        print(f"ความเสี่ยงเบาหวานพื้นฐานจากอายุ/เพศ = {base_risk:.1f}%")
        print(f"ความเสี่ยงรวม ≈ {base_risk:.1f}% + ({whorl_percent:.1f}% × 0.5) = {total_risk:.1f}%")
    else:
        print("⚠️ ไม่สามารถประเมินได้: อายุ < 45 ปี")
    
    return total_risk

# # ✅ ตัวอย่างการใช้งาน
# fingers_input = {
#     'R1': 'W', 'R2': 'A', 'R3': 'W', 'R4': 'W', 'R5': 'W',
#     'L1': 'W', 'L2': 'W', 'L3': 'A', 'L4': 'W', 'L5': 'A'
# }
# gender_input = 'F'
# age_input = 65

# calculate_diabetes_risk(fingers_input, gender_input, age_input)
