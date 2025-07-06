def manual_weighted_risk(retina_risk=None, fingerprint_risk=None, retina_weight=0.8, fingerprint_weight=0.2):
    """
    คำนวณความเสี่ยงโรคเบาหวานแบบถ่วงน้ำหนัก (Retina 80%, Fingerprint 20%)
    พร้อมจัดระดับความเสี่ยง A–F
    """

    # กรณีไม่มีข้อมูลทั้งสอง
    if retina_risk is None and fingerprint_risk is None:
        return "❌ Error: ไม่มีข้อมูล Retina และ Fingerprint"

    # กรณีมีเฉพาะ Fingerprint
    if retina_risk is None:
        print("⚠️ ใช้เฉพาะ Fingerprint Risk (ไม่พบ Retina)")
        total_risk = fingerprint_risk

    # กรณีมีเฉพาะ Retina
    elif fingerprint_risk is None:
        print("⚠️ ใช้เฉพาะ Retina Risk (ไม่พบ Fingerprint)")
        total_risk = retina_risk

    # กรณีมีทั้งสอง
    else:
        total_risk = (retina_risk * retina_weight) + (fingerprint_risk * fingerprint_weight)

    total_risk = round(total_risk, 2)

    # จัดระดับความเสี่ยง A–F
    if 0 <= total_risk < 10:
        level = 'A'; description = 'ปกติ (Normal)'
    elif 10 <= total_risk < 25:
        level = 'B'; description = 'ความเสี่ยงต่ำ (Low Risk)'
    elif 25 <= total_risk < 50:
        level = 'C'; description = 'ความเสี่ยงปานกลาง (Moderate Risk)'
    elif 50 <= total_risk < 70:
        level = 'D'; description = 'ความเสี่ยงสูง (High Risk)'
    elif 70 <= total_risk < 90:
        level = 'E'; description = 'ความเสี่ยงมาก (Very High Risk)'
    elif 90 <= total_risk <= 100:
        level = 'F'; description = 'สงสัยว่าจะเป็นเบาหวาน (Likely Diabetic)'
    else:
        return "❌ Error: ค่าความเสี่ยงไม่อยู่ในช่วง 0–100%"

    return {
        '🧠 Retina Risk (%)': retina_risk if retina_risk is not None else 'ไม่มี',
        '🖐️ Fingerprint Risk (%)': fingerprint_risk if fingerprint_risk is not None else 'ไม่มี',
        '📊 Total Diabetes Risk (%)': total_risk,
        '📈 Risk Level': level,
        '🩺 Risk Description': description
    }


# 🔍 ทดสอบทั้ง 3 เงื่อนไข

# เงื่อนไขที่ 1: มีทั้ง Retina และ Fingerprint
print("▶️ เงื่อนไขที่ 1: ทั้ง Retina และ Fingerprint")
result1 = manual_weighted_risk(retina_risk=60, fingerprint_risk=30)
for k, v in result1.items(): print(f"{k}: {v}")
print()

# เงื่อนไขที่ 2: มีเฉพาะ Fingerprint
print("▶️ เงื่อนไขที่ 2: มีเฉพาะ Fingerprint")
result2 = manual_weighted_risk(retina_risk=None, fingerprint_risk=30)
for k, v in result2.items(): print(f"{k}: {v}")
print()

# เงื่อนไขที่ 3: มีเฉพาะ Retina
print("▶️ เงื่อนไขที่ 3: มีเฉพาะ Retina")
result3 = manual_weighted_risk(retina_risk=60, fingerprint_risk=None)
for k, v in result3.items(): print(f"{k}: {v}")
