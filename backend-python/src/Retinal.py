def calculate_diabetes_risk_from_DR_stage(stage):
    """
    คำนวณความเสี่ยงเบาหวานชนิดที่ 2 จากระยะ DR (ค่าระหว่าง 1-5)
    """
    if 1 <= stage <= 5:
        return 20 + (stage - 1) * 15
    else:
        print("⚠️ ค่า Stage ไม่ถูกต้อง (ต้องเป็น 1 ถึง 5)")
        return None

def adjust_risk_by_age_and_gender(base_risk, age, gender):
    """
    ปรับค่าความเสี่ยงตามเพศและช่วงอายุ
    gender = 'ชาย' หรือ 'หญิง'
    """
    if age >= 65:
        if gender == 'ชาย':
            return base_risk + 29.2
        elif gender == 'หญิง':
            return base_risk + 26.0  # ใช้ค่ากลางของ 24–28%
    elif 45 <= age <= 64:
        if gender == 'ชาย':
            return base_risk + 18.0
        elif gender == 'หญิง':
            return base_risk + 13.7
    return base_risk  # ถ้าอายุน้อยกว่า 45 ไม่เพิ่ม

def calculate_diabetes_risk_from_eyes(dr_stage_R1, dr_stageL1, age, gender):
    risk_R1 = calculate_diabetes_risk_from_DR_stage(dr_stage_R1)
    risk_L1 = calculate_diabetes_risk_from_DR_stage(dr_stageL1)
    if risk_R1 is not None and risk_L1 is not None:
        avg_risk = (risk_R1 + risk_L1) / 2
        total_risk = adjust_risk_by_age_and_gender(avg_risk, age, gender)
        return total_risk

# # 🔻 ใส่ค่าที่นี่
# dr_stage_input_R1 = 4
# dr_stage_input_L1 = 3
# age = 66
# gender = 'หญิง'  # หรือ 'ชาย'

# # ✅ คำนวณ
# risk_R1 = calculate_diabetes_risk_from_DR_stage(dr_stage_input_R1)
# risk_L1 = calculate_diabetes_risk_from_DR_stage(dr_stage_input_L1)

# if risk_R1 is not None and risk_L1 is not None:
#     avg_risk = (risk_R1 + risk_L1) / 2
#     total_risk = adjust_risk_by_age_and_gender(avg_risk, age, gender)
#     print(f"ความเสี่ยงเบาหวานชนิดที่ 2 จาก DR ทั้งสองข้าง: {avg_risk:.1f}%")
#     print(f"รวมกับความเสี่ยงจากอายุและเพศ → ความเสี่ยงรวม: {total_risk:.1f}%")
