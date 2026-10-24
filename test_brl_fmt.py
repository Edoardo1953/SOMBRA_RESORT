import re

def fmt_brl(val):
    sign = "- " if val < 0 else ("+ " if val > 0 else "")
    num = abs(val)
    parts = f"{num:,.2f}".replace(",", "X").replace(".", ",").replace("X", ".")
    return f"{sign}R$ {parts}"

def fmt_diff(v1, v2):
    diff = v2 - v1
    return fmt_brl(diff)

def fmt_pct(v1, v2):
    diff = v2 - v1
    if v1 == 0:
        return "-"
    pct = (diff / abs(v1)) * 100
    sign = "+" if pct > 0 else ""
    return f"{sign}{pct:.2f} %".replace(".", ",")

print("Helper tested:", fmt_brl(1591722.73), fmt_diff(1591722.73, 976766.78))
