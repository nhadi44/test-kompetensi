function cekGaji(golongan) {
    switch (golongan) {
        case "A":
            return 5000
        case "B":
            return 7000
        case "C":
            return 8000
        case "D":
            return 10000
    }
}

function gajiKaryawan(nama, golongan, jam) {
    var gaji
    var lembur
    switch (golongan) {
        case "A":
            gaji = 5000 * jam
            break
        case "B":
            gaji = 7000 * jam
            break
        case "C":
            gaji = 8000 * jam
            break
        case "D":
            gaji = 10000 * jam
            break
        default:
            gaji = "Golongan tidak terdaftar"
    }

    if (jam > 48) {
        lembur = (jam - 48) * 4000
    }

    var totalGaji = gaji + lembur

    console.log("Gaji Karyawan")
    console.log("--------------------")
    console.log("Nama:" + nama)
    console.log("Golongan: " + golongan)
    console.log("Jam Kerja: " + jam)
    console.log("Upah: Rp." + gaji)
    console.log("Uang Lembut : Rp." + lembur)
    console.log("Gaji: Rp." + totalGaji)
}

var test = cekGaji("A")
var test2 = gajiKaryawan("hadi nurhidayat", "A", 49)

