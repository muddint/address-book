from database import create_tables, add_contact, add_email

#init if not already exists
create_tables()

# Add contacts from Figma
contact1 = add_contact("Andra", "Inde")
add_email(contact1, "andrainde@gmail.com")
add_email(contact1, "ainde@yahoo.com")

contact2 = add_contact("Archibald", "Burns")
add_email(contact2, "archibaldburns@gmail.com")
add_email(contact2, "aburns@yahoo.com")

contact3 = add_contact("Berk", "Carruth")
add_email(contact3, "berkcarruth@gmail.com")
add_email(contact3, "bcarruth@yahoo.com")

contact4 = add_contact("Craggy", "Bramble")
add_email(contact4, "craggy.bramble@gmail.com")
add_email(contact4, "cbramble@marcham.com")
add_email(contact4, "craggy3029@yahoo.com")

contact5 = add_contact("Davita", "de Juares")
add_email(contact5, "davitadejuares@gmail.com")
add_email(contact5, "ddejuares@yahoo.com")

contact6 = add_contact("Dione", "Gibbett")
add_email(contact6, "dionegibbett@gmail.com")
add_email(contact6, "dgibbett@yahoo.com")

contact7 = add_contact("Federico", "Baynham")
add_email(contact7, "federicobaynham@gmail.com")
add_email(contact7, "fbaynham@yahoo.com")

contact8 = add_contact("Fifi", "Soitoux")
add_email(contact8, "fifisoitoux@gmail.com")
add_email(contact8, "fsoitoux@yahoo.com")

contact9 = add_contact("Florinda", "O'Connell")
add_email(contact9, "florindaoconnell@gmail.com")
add_email(contact9, "foconnell@yahoo.com")

contact10 = add_contact("Gerry", "Deaville")
add_email(contact10, "gerrydeaville@gmail.com")
add_email(contact10, "gdeaville@yahoo.com")

contact11 = add_contact("Gorden", "Maleney")
add_email(contact11, "gordenmaleney@gmail.com")
add_email(contact11, "gmaleney@yahoo.com")

contact12 = add_contact("Jackie", "Gritton")
add_email(contact12, "jackiegritton@gmail.com")
add_email(contact12, "jgritton@yahoo.com")

contact13 = add_contact("Killy", "Akitt")
add_email(contact13, "killyakitt@gmail.com")
add_email(contact13, "kakitt@yahoo.com")

contact14 = add_contact("Lavinie", "Nevett")
add_email(contact14, "lavinienevett@gmail.com")
add_email(contact14, "lnevett@yahoo.com")

contact15 = add_contact("Meggie", "Stetson")
add_email(contact15, "meggiestetson@gmail.com")
add_email(contact15, "mstetson@yahoo.com")

contact16 = add_contact("Nedi", "Cray")
add_email(contact16, "nedicray@gmail.com")
add_email(contact16, "ncray@yahoo.com")

contact17 = add_contact("Raddie", "Sear")
add_email(contact17, "raddiesear@gmail.com")
add_email(contact17, "rsear@yahoo.com")

contact18 = add_contact("Sarina", "Scrace")
add_email(contact18, "sarinascrace@gmail.com")
add_email(contact18, "sscrace@yahoo.com")

contact19 = add_contact("Theobald", "Marczyk")
add_email(contact19, "theobaldmarczyk@gmail.com")
add_email(contact19, "tmarczyk@yahoo.com")

contact20 = add_contact("Tudor", "Marcham")
add_email(contact20, "tudormarcham@gmail.com")
add_email(contact20, "tmarcham@yahoo.com")

contact21 = add_contact("Lotsa", "Emails")
for i in range(20):
    add_email(contact21, f'testemail{i}@gmail.com')
