import { useState, useEffect, useRef } from "react";

const LOGO_SRC = "data:image/png;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/4gHYSUNDX1BST0ZJTEUAAQEAAAHIAAAAAAQwAABtbnRyUkdCIFhZWiAH4AABAAEAAAAAAABhY3NwAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAQAA9tYAAQAAAADTLQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAlkZXNjAAAA8AAAACRyWFlaAAABFAAAABRnWFlaAAABKAAAABRiWFlaAAABPAAAABR3dHB0AAABUAAAABRyVFJDAAABZAAAAChnVFJDAAABZAAAAChiVFJDAAABZAAAAChjcHJ0AAABjAAAADxtbHVjAAAAAAAAAAEAAAAMZW5VUwAAAAgAAAAcAHMAUgBHAEJYWVogAAAAAAAAb6IAADj1AAADkFhZWiAAAAAAAABimQAAt4UAABjaWFlaIAAAAAAAACSgAAAPhAAAts9YWVogAAAAAAAA9tYAAQAAAADTLXBhcmEAAAAAAAQAAAACZmYAAPKnAAANWQAAE9AAAApbAAAAAAAAAABtbHVjAAAAAAAAAAEAAAAMZW5VUwAAACAAAAAcAEcAbwBvAGcAbABlACAASQBuAGMALgAgADIAMAAxADb/2wBDAAUDBAQEAwUEBAQFBQUGBwwIBwcHBw8LCwkMEQ8SEhEPERETFhwXExQaFRERGCEYGh0dHx8fExciJCIeJBweHx7/2wBDAQUFBQcGBw4ICA4eFBEUHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh7/wAARCAEPAhkDASIAAhEBAxEB/8QAHQABAAMBAQEBAQEAAAAAAAAAAAcICQYFBAMCAf/EAGIQAAEDAwICAgkMCwsJBwQDAAEAAgMEBQYHEQgSITEJExQXOEFRYbMYIjI2V3F1gZKVtNIVIzdCVVZ0hJTR1BYzUmJydoKRobGyJCc0R2eFo6TENUNTY3ODoiUmRJPCw+H/xAAUAQEAAAAAAAAAAAAAAAAAAAAA/8QAFBEBAAAAAAAAAAAAAAAAAAAAAP/aAAwDAQACEQMRAD8A6ezcE+nzLXTNvOTZRPcBGO6H0k0EUJf4+RroXED3yV9fqKtLPw/mf6ZTfs6lHidvl2xvQnKL3Yq6aguNLBG6CoiOzoyZo2kj4iR8az87/wBrL7oV5+W39SC2XqKtLPw/mf6ZTfs6eoq0s/D+Z/plN+zqpvf+1l90K8/Lb+pO/wDay+6Feflt/Ugtl6irSz8P5n+mU37OnqKtLPw/mf6ZTfs6qb3/ALWX3Qrz8tv6k7/2svuhXn5bf1ILZeoq0s/D+Z/plN+zp6irSz8P5n+mU37Oqm9/7WX3Qrz8tv6k7/2svuhXn5bf1ILZeoq0s/D+Z/plN+zp6irSz8P5n+mU37Oqm9/7WX3Qrz8tv6k7/wBrL7oV5+W39SC2XqKtLPw/mf6ZTfs6eoq0s/D+Z/plN+zqpvf+1l90K8/Lb+pO/wDay+6Feflt/Ugtl6irSz8P5n+mU37OnqKtLPw/mf6ZTfs6qb3/ALWX3Qrz8tv6k7/2svuhXn5bf1ILZeoq0s/D+Z/plN+zp6irSz8P5n+mU37Oqm9/7WX3Qrz8tv6k7/2svuhXn5bf1ILZeoq0s/D+Z/plN+zp6irSz8P5n+mU37Oqm9/7WX3Qrz8tv6k7/wBrL7oV5+W39SC2XqKtLPw/mf6ZTfs6eoq0s/D+Z/plN+zqpvf+1l90K8/Lb+pO/wDay+6Feflt/Ugtl6irSz8P5n+mU37OnqKtLPw/mf6ZTfs6qb3/ALWX3Qrz8tv6k7/2svuhXn5bf1ILZeoq0s/D+Z/plN+zp6irSz8P5n+mU37Oqm9/7WX3Qrz8tv6k7/2svuhXn5bf1ILZeoq0s/D+Z/plN+zp6irSz8P5n+mU37Oqm9/7WX3Qrz8tv6k7/wBrL7oV5+W39SC2XqKtLPw/mf6ZTfs6eoq0s/D+Z/plN+zqpvf+1l90K8/Lb+pO/wDay+6Feflt/Ugtl6irSz8P5n+mU37OnqKtLPw/mf6ZTfs6qb3/ALWX3Qrz8tv6k7/2svuhXn5bf1ILZeoq0s/D+Z/plN+zp6irSz8P5n+mU37Oqm9/7WX3Qrz8tv6k7/2svuhXn5bf1ILZeoq0s/D+Z/plN+zqAuLjQWzaQwWS545d7hW2+4ySQSRV5Y6WORoDgQ5jWgggno5Rtt1nfo97hO1f1LyjiAxqxZBmVzuNsqe6u3U0zgWP5aSZ7d+jxOa0/EpG7JR7R8S+EpvRIKMoiICIiAiIgIiICIiAiIgIiICIiAiIgIiICIiAiIgIiICIiAiIgIiICIiDT/jB8G3MfyaL08azAWn/ABg+DbmP5NF6eNZgICIiAiIgIiICIiAiIgIiICIiAiIgIiICIiAiIgIiICIiAiIgIiIJm4JfCdxH89+hTqwHZKPaPiXwlN6JV/4JfCdxH89+hTqwHZKPaPiXwlN6JBRlERAREQEREBERAREQEREBERAREQEREBERAREQEREBERAREQEREBERAREQaf8AGD4NuY/k0Xp41mAtP+MHwbcx/JovTxrMBAREQEREBERAREQEREBERAREQEREBERAREQEREBERAREQEREBERBM3BL4TuI/nv0KdWA7JR7R8S+EpvRKv8AwS+E7iP579CnVgOyUe0fEvhKb0SCjtNBPVVDKemhknmkOzI42lznHyADpKkPFtCtXclLTbMBvLWO6RJWRCkYR5Q6YtBHvLhrBeLpYLxTXiy19Rb7hSv54KiB5Y+M7bdBHmJHnBWkfBxqJftSdITdcllZUXKguMlvkqGsDDOGxxva9wHRzbSAHYDfbqQUH1c0syrS2rttHljKKKpuEDp44qeftpY1ruX1xA2338hK+7S3RHUnUeEVeOY/J9jiSO76t4gpzt18rndL+no9YHbeNWy4xLRitJmdkz/PIDW2OzW8xU1ra/ldda18hcyHfxRta0vefJsOnm2Vc73xR6wVde2S0Xykx+gh2bTW+32+AQwsHU317HEgDYbE7dHQAg965cHGrtJSCeCbGq+Qt5u0U9e8PB/g7yRtbv8AHt51BmX4vkOIXuWy5NaKu1V8Y3MNQzlJHic09TmnxEEg+VXg4S+JOt1Cvf7is3jpY74+N0lBWwM7Wyr5Ru5jm77CQAFwLdgQD0Aj13Ycaen9BmWi90u3czTd8ehfcKScD1wjZ0zMJ8bSwOO3la0oM10Reth+PXXLMot2N2On7ouNwnbBAzfYbnxk+JoG5J8QBKD47VbrhdrhDbrXQ1NdWTu5IqenidJJIfIGtBJKkuq0Gza0W6C4ZhV47h0FR0wi93RkUrx5REznk+Ll38yu5g2A4Xw66TXW/wAdMysuNDb31FxuL27TVb2t3EbSd+Rhds1rR0dRO53Kzsz7Lb5nGV12TZFWPqq+skLnEk8sbd/WxsB9ixo6APEEHXWzSJ95qo6PH9RsAu1bKeWKljuU1PJI7o9a3uiGMEnfoAPiK8LUPTPO9P52x5djNdbGPdyxzuaHwSHyNlYSwnzb7rkFfTgjz1upenN308zZkV5ktLGNYK1ol7po37gNdzb8xY4bbnxOZ5EFC0U68XGh50pyKG62PtsuLXWRwpi/dzqSXrMDneMbblpPSQCDuWkmCkBERAREQEREBERAREQEREBERAREQEREBERBp/xg+DbmP5NF6eNZgLT/AIwfBtzH8mi9PGswEBERAREQEREBERAREQEREBERAREQEREBERAREQEREBERAREQEREEzcEvhO4j+e/Qp1YDslHtHxL4Sm9Eq/8ABL4TuI/nv0KdWA7JR7R8S+EpvRIKMq//AGOL7iF5/nJP9GplQBX/AOxxfcQvP85J/o1MgjfslNTUOy/EKMzPNOygnlbHv60PdIAXbeUhrR8SqQrY9ko9veJ/BkvpVU5B3XD7VTUeuuCy07+R7sgooif4r5mMcPja4hagaixsm0+yOKQczH2qqa4b9YMTt1lxoT92/A/5yW76TGtSs/8AaJkHwZU+icgyCVtuxwYjT1uUZFmlVE177ZBHR0ZI35Xy8xkcPIQ1gb7zyqkq/PY4GwDR2/PaR285BIHjfp5RTwcvR75cg6Lj4uklv4ea2mjfyi43GlpXecBxl26//KWciv8A9kd+4hZv5yQfRqlUAQFYPgBuUtDxBQUkbiGXC2VNPIPEQAJR/bGFXxTNwS+E7iP579CnQXt4lMThzPRHJ7PJE187KJ9XSEjpbNCO2M2Pi35eX3nFZWLZOsZA+kmZUlogdG4S8zthy7dO58XQsbEBERAREQEREBERAREQEREBERAREQEREBERBp/xg+DbmP5NF6eNZgLT/jB8G3MfyaL08azAQEREBERAREQEREBERAREQEREBERAREQEREBERAREQEREBERAREQTNwS+E7iP579CnVgOyUe0fEvhKb0Sr/wS+E7iP579CnVgOyUe0fEvhKb0SCjKv/2OL7iF5/nJP9GplQBaC9jqpZ6fQu4yzRuYypyColhJHs2iCBm4/pMcPiQRX2Sj294n8GS+lVTlbjslVJUNyzD68xnueShnha/xF7ZGkj+p7VUdB2ehP3b8D/nJbvpMa1Kz/wBomQfBlT6Jyy84fKSes11wWGnYXvbkFFKQP4LJmvcfia0n4lqVl9LNXYneKKmbzTVFBPFG3yudG4Af1lBj2ri9jZyiCOtyrDZ5eWWdsVxpWE9DuXeOXbz+ui+IHyKnkjHxyOjkY5j2khzXDYgjrBC6LTLMrrgGdWvLbMQaqgm5+1uJDZmEbPjdt4nNJHx7+JBfDsgVudW8Pz6lrOYW+7U1Q47exB54t/8AigfGs61qG+64txCaE3eksFfE5l1oXQvie4dsoarbmY2VvWC14afOBuOggrMm/Wm42K81lmu9JLR19FM6GogkGzmPadiCg+JT3wE299ZxFW+obGHChoKqocdgeUGPtW/m6ZAPjUCK8XY8sBqLLjl61GvEXcrbmwUtA6X1v+TsPNJJ0/eucGgH/wAsnqIQWA14yaHD9Hspv8sgY6C3Ssg6dt5pB2uMfLc1ZOqy/GxrjSZ7dIsKxSq7djtsm7ZU1TD62tqBuBynxxsBOx6nEk9QaVWhB+9DRVlfUCnoaSeqmIJEcMZe4gdZ2HSvznilgmfDPG+KVji17HtIc0jrBB6itJOCTF8fsug9lu9rghfX3dslRX1YaDI94kc3kJ6+VgaBt1bgnrJUY9kexfH4sdx/LooIIL9JX9xSOY0B9TAY3v3d5eQtaAf46CkyIiAiIgIiICIiAiIgIiICIiAiIgIiINP+MHwbcx/JovTxrMBaf8YPg25j+TRenjWYCAiIgIiICIiAiIgIiICIiAi/qJj5ZGxRMc97yGta0blxPUAPKul73mf/AIj5N80z/VQcwi6fveZ/+I+TfNM/1U73mf8A4j5N80z/AFUHMIun73mf/iPk3zTP9VO95n/4j5N80z/VQcwi6fveZ/8AiPk3zTP9VO95n/4j5N80z/VQcwi6fveZ/wDiPk3zTP8AVTveZ/8AiPk3zTP9VBzCLp+95n/4j5N80z/VTveZ/wDiPk3zTP8AVQcwi6fveZ/+I+TfNM/1U73mf/iPk3zTP9VBzCLoqvBc3pKaSqq8OyKngiaXySy2yZrGNHWSS3YDzrnUBERBM3BL4TuI/nv0KdWA7JR7R8S+EpvRKv8AwS+E7iP579CnVgOyUe0fEvhKb0SCkFvqG0lfT1TqaCqbDK2QwTgmOUAg8rgCCWnbY7EHY9YVhrLxg6g2S1U9qtGJYHQUFMzkgp6e31DI42+QNE+wVckQTzn3FHl+dY/LY8nwvBLhSP3LO2UFQXwv2IEkZM55XDc7Ef3dCgZEQSPovq7dtKaietsOM4vX3GUnlr7lSyyzwsIALGOZK0Naduno3O56duhSl6tXVP8AAGGfodT+0KsyIOs1RziXPshN9qsbx6yVcgJqPsPTPhZUPJ3Mj2ue7d/lI238e5XJoiD3sGzLJ8IvTLxil6q7VWt2BfC71sg/gvad2vb5nAhSNlWt1uzztU+pOm1jvlyiaGfZOgqJbfVPaOoPc3ma7o323bsPEAobRBJlszTS60VUdZQaRyV1RGeZjbzkL6qHfo23jjhiDh19BJB3X76oa+aj5/bvsPcLlBa7JyCMWu1Q9z0/IBsGnpLnN229a5xHR1KLEQEREEpaNa8agaV0U1ux6qo6q2SydtNDcITLC1563N5XNc3fxgOAPk3XhataoZjqjeYbnllwZOadpZTU8Mfa4YAdt+VvlOw3JJJ2HT0BcUiAiIgIiICIiAiIgIiICIiAiIgIiICIiDT/AIwfBtzH8mi9PGswFp/xg+DbmP5NF6eNZgICIiAiIgIiICIiAiIgIiIJz4FrPFduIq0TTQslZbqaprNnAEBwjLGu98OkaR5CAVerVXVvBdMZLfFmN1lopLgJHUzY6WSYuDOXmJ5AdvZDr6/iVTuxtWzt2ouUXjl37ltLKbfydtma7y/+T5P6vH8vZHrkZ9WbDamu3ZSWVspHkdJNJv8A2MagsJ6rDRL8ZK35sqPqJ6rDRL8ZK35sqPqLNlEGk3qsNEvxkrfmyo+onqsNEvxkrfmyo+os2UQaTeqw0S/GSt+bKj6ieqw0S/GSt+bKj6izZRBpN6rDRL8ZK35sqPqJ6rDRL8ZK35sqPqLNlEGk3qsNEvxkrfmyo+onqsNEvxkrfmyo+os2UQaTeqw0S/GSt+bKj6i+/HeJfSTIb7Q2Oz3m4Vdwrp2wU8LLXPu97jsB7HoHlJ6AOkrMpXM7HtpZ/pOql4pv4dJZWvH9Gacf2xg/+p5kFtczyG1YnilyyS9ziG3W6ndPO7rJA6mgeNxOwA8ZICyLv1ZBcL5X19NRx0UFTUyTRU0fsYWucSGDzAHb4lansgmqv2TvUGmFmqd6S3ObUXdzHdEk5G7IujxMB5iP4Th1FiqSgIiIJm4JfCdxH89+hTqwHZKPaPiXwlN6JV/4JfCdxH89+hTqwHZKPaPiXwlN6JBRlERAREQEREBERAREQEREBERAREQEREBERAREQEREBERAREQEREBERAREQaf8YPg25j+TRenjWYC0/wCMHwbcx/JovTxrMBAREQEREBERAREQEREBERBePsatr7Vh2X3nlI7quEFLzeXtUbnbf8b+1QPxu3P7JcSORMa4OjomU1KwjzQMc4fE5zgrW8Adr7g4eqWr5dvslc6qq3269nCHfz/vXn6lUvJsLy7WPiJzOnxG2urC69VPbKl7uWCniErmsdI/qHrW9AG5Ox2BQQ2ivzppwbYNaKaOfN6+sySuIBfDFI6mpWnyDlPbHe/zDfyBSf8AuE0Gwx0dPV47gdrlA9YbhHT9t26ep027vGfGgy3Ramf5gv8AZn/yKf5gv9mf/IoMs0Wpn+YL/Zn/AMin+YL/AGZ/8igyzRamf5gv9mf/ACKf5gv9mf8AyKDLNFqZ/mC/2Z/8ivVseNaS32OWWyWDCLoyIhsjqOjpZgwnqBLQdigzF0sw246gZ/aMRtfrZrhOGPl5dxDGPXSSHzNaCfPtt41pHqnk9h0M0PkqbdBFDFbaVlBZ6Rx/fZy3aMHq36i9x6yGuPWuwtGGYhZ7q27WjF7Lbq9sToRUUlDHC/kcQXN3aB0EtH9Sobx16mOzHVA4tbqjns2NF1P609EtWf353n5dhGPIWu29kggC6V9ZdLnVXO41MlTWVcz56iaQ7ukkcSXOJ8pJJXzIiAiIgmbgl8J3Efz36FOrAdko9o+JfCU3olX/AIJfCdxH89+hTqwHZKPaPiXwlN6JBRlf1Gx8kjY42Oe9xAa1o3JJ6gAv5V+uBXSK0WXAqTUK8W+Govt2JlopJWBxpKYEhvJv1OfsXFw6di0dHTuFRqTRbU6a3RXGfFZrZSSjeOa61UFva7o3GxqHs36F9UGhGqlVC6a3YzHdI2gFzrbc6Ss2BO3/AHMrl5Gt+TX/ACrVLILjkVVPLVMr5oGRSE7U7GSOa2JrT7ENA228u5O5JK5a0XK42i4RXG019VQVkLuaKoppXRyMPlDmkEIPtyfFslxeqFNkmP3SzzE7NbW0j4S73uYDcecLx1evh/1kOrekmWYfnEVJX322WiacPmiaRXQBhHbHM25edjuUEjr5mnr3VFEBfRbqKtuNbFQ2+kqKyrmdyxQQRmSR58jWjpJ95e5pnhd61BzW34pYYg+srX7F79+SFgG7pHkdTWjc/wBQHSQr/SWDT/he0cuGQW63R1dzjibF3XOB3RcKl3QxnN96zfp5W9Aa0npO5IUqGg2qkdFDW3HGo7PTzHZj7tcqWhJPk5ZpGu382y/DI9DdWbBbBc6/CbhLRFnP2+hfHWMDevmJgc8AefqXL55l+RZxklTkGTXOavr6hxJc8+tjb4mMb1NaPEApX4Sda7npxmlHZLpWyS4lc52w1MEj920j3HYTs39jsT64DrG/jAQQWQQSCNiF7OMYnlWUd0fuZxq9Xvubl7o+x1DLUdq5t+Xm5Gnl35Xbb9ex8ivBxk6BWzJccr89xO3x0uRUMbqithgaGtr4mjd5LR/3rQCQR0u2IO522ovj1+vePV7K+w3eutdUxwcJaSd0Ttx1dLSN0HQ96fVP3NMz+Yqn6id6fVP3NMz+Yqn6i0E4TtWJNVdNu6ro+L90FrkFLcmsHKJCRuyblHQA8A9A6OZrtthsuA7IjW5PQadWGazV1bS2uS4PiuPc8rmB5LN4g/brb61/X0b7ePZBQde9jeF5jk1LJV43id+vVPE/tcktvt0tQxj9geUljSAdiDt514K9bGsmyHGa6Otx693C11Ebw9r6WodH0jygHY+8egoPd70+qfuaZn8xVP1F8V709z6x2ua6XvB8mtlBBy9tqqy1TwxR8zg0cz3NAG7iANz1kBX0u+vb7DwsWXUm5QwSZBdqUU9LT7bMmqwXNc8tHUwcjnkDzN3G4VBcxzTK8wuU9wyXILhc553cz+3TEsHTvs1nsWgbDYAADZBz69jE8WyTLLj9j8ZsVxu9UNi6Okp3SFgPjdsNmjznYKSuFvRaq1dy6QVkk1JjdtLXXGpj6HvJ35YYyRtzO26T96Onr2Bs5xPZ7aNBNNqDBtNqGls12ujHdpNOwb0sA6HzEnpdI4+tDnbncOO+7Qgqm7h/1Ujq46Gosdupa6UAxUdTfaGKofv1bRumDv6wFz2daXahYPGZcpxG6W2nB27pdFzwb+TtrN2b+bdcnWVNRWVUtVV1EtRUTOL5JZXlz3uPWST0k+dXR4GtZKzJTNpTmk/2TJpnvtc1V9sdLG0fbKd/N7MBu7hvv60OHUAEFKUVmONTQqjwCthzXEaXtGO183aqmkb0topzuRy+SN2x2H3pG3UWhQTp5mF1wbJocgs8Funqomlna66kZUROB239a4dB6B0ggjy9JQfzjGE5jlDgMcxa9XYE7c1JRSStHvuA2HxlflmeKZDht5+w2T2yW2XDtTJjTyuaXBjhu0nYnbfyHpWpWiGajUPSqw5j3EyifcIXdsgYSWskjkdE8N3+95mHbzbdarVxM45iNBrbdtSNSI5amwUVNS01utMTuWS71Yj5izfxRMBaXu/jNHT1EKuYLprnucNfJimK3O6QsOzp4ouWEHydsds3fzb7rpMh4e9ZrDSyVVwwK4uijbzPNJJFVEDy7QvcVIsfGPnlDUwwWPFMSttlpwI6e3MppSI4x1N5myNG48zQPMrUcN+uFl1hstSYqT7F32gDTW0DpOccp6BJG7YczCRt1btPQesEhmHIx8cjo5GOY9pIc1w2II6wQv5V2eyC6W2z7AQan2ikZT10NQymu3a2ACeN/QyV233wdyt38YcPIFSZAREQEREGn/GD4NuY/k0Xp41mAtP+MHwbcx/JovTxrMBAREQEREBERAREQEREBERBqdwt2z7EcPeE0vLy9stbKrb/ANYmbf8A4i6rB8Sx/B8fFqsdIylpw501RK47yTyOO75ZHnpc4nc7nq6hsAAoC044rdJrXpnY6K5SXSiuFvt0NLLQR0TpCHRsDPWPHrS07dG5B26wFBvEVxQ37UWjmxzF6aox/HJByz7yf5VWNPW2QtOzGeVjSd/GSDsg7Xih4p62orqrENL6/uejiJiq73CfXzO6i2A/etH/AIg6T97sOl1RqqonqqmSpqppJ55XF0kkji5z3HrJJ6SV+SICIiAiIgIiIPdwLFLzm+XW7F7BTdvuFfKI4wd+Vg63PcR1NaAXE+QFamaP4BZtNMDoMVsrA5kDeepqC3Z9VOdueV3nJ6h07AAdQUUcFmjPe9w85RfqXkya9RAuY9uzqOmOxbF5nO6HO/oj73pknTvKP3eZFeb5bpA/G7XO6222Rp3bWTt/0ioB6iwEtjYR5JDuQ4bB8HE1qGNNNIbrfaeRrbpOO4rYCenuiQEBw8vI0Of/AEVlrI98kjpJHOe9xJc5x3JJ8ZViePPUN2V6r/uWoajnteNNNOQ0+tfVO2MzvPy7NZ09Ra7yquiAiIgIiIJm4JfCdxH89+hTqwHZKPaPiXwlN6JV/wCCXwncR/PfoU6sB2Sj2j4l8JTeiQUZWofCXktvyXQHFpKF8fPbqNltqo2gAxywgMO48rgGv84cFl4pO4etY77pDlLq6iaa2z1ha2425z9mytB6HtP3sg6dj5yCgsfxc8NNzyK91ef6fQNqK6p+2XO1AhrpX7bGWHfoLj1uadtzuRuTsqUVlLU0VXLSVlPNTVMLyyWGVhY9jh0FrmnpBHkK1k0t1HxHUqwNvGK3SOqaAO6Kd3rZ6ZxHsZGdYPn6Qduglc3rdoXg+qtI+W6Uf2PvbWcsN2pGgTN26g8dUjfM7p8hG6DOvRzMWYNmovM7ah9JLQVdHURwNBc9s0D2DoJA6Hljuv73x9S41SFrdpDluk19ZQ5BAyaiqCe4rjACYKgDrA36WuG/S09Pk3HSo9QXn7HJhkFHh17zqeJprLjU9wUzj1sgjAc/b+U9w3/9MLneyUZFUGvxLE43ubTtimuMzfE95Pa4z8QEnyipz4MaWKl4asRbFse2R1Er3AAEudUyk7+91fEFAXH07Do9XrQ/JLdkU9Q6wRCOSgrIoouQVFR0EPicS4Enfp6iOjyhURF2fdGln4IzP50pv2dO6NLPwRmfzpTfs6DTDQq+S5NoziV6qiX1FTaYO3ud088jWBr3fG5pPxrM3W3HIsR1cynHadna6aiuczadu23LCXc0Y+Q5qsLpjxZ45gWCWvEbdgt2qqW2xujjlnukfbHAvc/p2iA63HxKvuuGa02omqV5zKktjrXFcnQuFK6QSFhZCyMkuAG+5YXdXjQdtwa6iHAdZaGKsqO1We+bW+t39i1zj9qkPk5X7AnxNc5aB6u4ZR6gacXrEqzlaK+mLYZHDftUw9dG/wCJ4afe3CyTBIIIOxC1C4VdQu+No5arnUzmW60I7guXMd3OmjA9ef5bS13vkjxIMxrtQVdqulXa7hA+nrKOd9PURP8AZRyMcWuafOCCF8zGue9rGNLnOOwAG5J8isx2QHT39zupVPmlDT8tvyJn28tb61lXGAHe9zN5Xech58qiPQyjphmjsmuUTZLZi9JJeqlrx617otu0Rnq3553Qs2J6Q4oPU4grtUQVeP6cibekwy2MoJGNPrTXPAkq3e+JD2v/ANvzqLl9FyrKm43GpuFbK6apqpXzTSO63vcSXE++SV/lugbU3Cmpnv5GyytYXeQEgboNRuGDDIMG0Rx21MiayqqaZtfXOHW6eYB7t/LygtZ7zAqI8Y2RVGRcQ2Sule4w26Vtup2n7xkTQHAe+8vd/SWnEbGRxtjjY1jGgBrWjYADqACzK1rk05i1jzRlytGXGs+z9cZzFcadjHPM7yS1roCQ09Y3J6COkoIdXY6IXybG9X8TvULnNNPdqftnKdi6NzwyRvxsc4fGv67o0s/BGZ/OlN+zr9qKv0upayCpZZsyc6GRsgBulNsSDv8A+Ag0q13xuHLdHcqsEsfO6otsr4Ry77TRjtkR28z2tKycV2JeN+zSxPik05rHse0tc03NmxB6x+9qk6DTLgl8GLEfz36bOqsdkGuldWa7Nt087nUtBbIG00fiZz7vcffJPX5APIrT8EvgxYj+e/TZ1Uvj58Iit+DqX/AUEAqcuBa41NFxJWKmgcWx3Cmq6ecb+yYKd8oHyomn4lBqmbgl8J3Efz36FOgu9xbU8VVw5ZnHM3ma2ibIBsPZMlY5vX52hZdrUrir8HfNPg4/42rLVAREQEREGn/GD4NuY/k0Xp41mAtP+MHwbcx/JovTxrMBAREQEREBERAREQEREBERAREQEREBERAREQFZHgd0e/dtmP7tb7S82PWOYGFj27tq6sbFrPO1nQ53n5R0glQjprh92z3OLXidlj5qu4TBnORu2Jg6XyO/itaC4+9sOlaXXKqxLQLREOZH2u1WOkEcMY2ElXOeoed8jyST1DcnoAQR3xl6p1ljtdHphh8j5Msycsp/tLtn08EjuQAHxPkJ5R5BzHoPLv22Q1ls0E4cHdylj/sDbGwUu4/0ird0NJH8aVxcfMSqwcH1uu+rHEfdNSsmd3U61h1dK4g8gqJAWQRgHqa1ocWjfo7W1e72RzOjPdLHp3Rzfa6Zn2Trw09cjt2QtPkIbzu2/jtKCodZUz1lXNV1Ur5qieR0ksjzu57nHcknyklfkiICIiAiIgmbgl8J3Efz36FOrAdko9o+JfCU3olX/gl8J3Efz36FOrAdko9o+JfCU3okFGV02Y4lLjtixW7uq+6Ichtjq5o7Vydpc2eWJ0e+55thG12/R7Pbbo3PMq2WZ6a1uZcE+B5JZaR1Tc8dhqJXxRs3fJSvmf2zbbrLS1rtvIHfGFYsUyO+4pfIL3jl1qrZcYDvHPTv5XbeMHxOafG07g+MK7XDnxYUeVV9HiuocEFtu87mxU1zh9bTVLzsA17f+7eT4x60k/e9ANEEQa4aqYRZ9Q8FuWKXqMGCrjPa5Q3d1PKPYSt87T0+fpB6CVk9kNqq7Ff7jZK9obV2+qlpJ2jqEkbyxw/rBWnXDJlFZkPDzi+R3+p+3topI6iomf0ubBLJF2x7j4y2MOJPlJWbmq9+p8o1OyfIqQbU1xutTUwdGx7W6RxZv5+XbfzoL19j/wAjhu2g8dlEg7fY6+enczbYhkjjM13nBMjx/RK4Dsk2LTSUuK5nBEXRQult1U4D2PN9si+Lol/s8qhDhM1ZbpVqP265OecfuzW0tyDentYB3jmA8ZYSd/4rnbdOy0OznGcd1L0+rLDcXsrLRdqYOjqKd4dtvs6OaNw3G4PK4HpB84OyDI5FLGr+gOomnV0qGz2Wqu9na49oulBC6SJzN+gvDdzGfKHdG/UT1qO7NjuQXqvFBZ7HcrhVl/J2mmpXyP5vJs0E7oPLRWOxPSx2jGMHVbVFlPT3aAf/AG1j73tfJPWbbxyzAbgNjOzy0dI26djs11dJ5ZJ55Jpnl8kji57j1kk7koP4ViOA7UP9yWrIxmum5LZkzW0vrj0Mqm79pP8ASJcz33t8iruv1pKiekqoaqmlfDPC9skUjDs5jgdwQfEQQg1M4ktPmalaRXjH442uuMbO67a4jpbUxgloH8oczD5nlZ51zX4rohBQvaYrll1wNTM0t2e2hpHOjjadz0B9QZTtt1wN6Vo3oRnUOo+ldkypjm90zw9rrWDb7XUM9bINh1Akcw8zgs5OJDLabMtYr7c7cI2WqCd1Jb2RABghjJHM0DqD3c8nvvKCOkREGu+mmRw5dp9YcmgkD23KgiqHEDbZ5aOdu3iIdzD4lnpxsYtNjXEDe5zEW0t5bHcad23Q7nbtJ8fbGv8A7FK/APrHSW9h0syKqZBHNM6WyTyO2bzvO76ck9XM71zfKXOHWQFPPE7ozRav4hFBDNHRZBbS6S21TweQ8wHNFJt08jth0jpaQCN+kEMw0XX53pnnmEV8lJk2L3Ki5Cdp+0l8DwPG2Ru7XD3ivwwrT3N80rY6XGMXulyc8j7ZHARE0HqLpDsxo6eskBBy6Ke9T8VtWiGm8+IVNdS3HUHJo4xdO0EOjtdC1wkELT188j2s3PjDT0bbF0CINMuCXwYsR/Pfps6qXx8+ERW/B1L/AICrbcFMb4+GTEWyNLSW1jtiPEaycg/GCCqmcfsUkfELUvewtbLbKVzCfvhs4bj4wR8SCvymbgl8J3Efz36FOoZU08EMUknE1ir2MLmxNrHPI+9Hccw3PxkD40F4eKvwd80+Dj/jastVqbxSwyT8PWasiYXuFse8geRpDifiAJWWSAiIgIiINP8AjB8G3MfyaL08azAWn/GD4NuY/k0Xp41mAgIiICIiAiIgIiICIiAiIgIiICIiAiIgIilbhb0yfqhqrR2yqicbLQAVl0eB0GJpG0e/le7Zvl25j4kFquA7SkYphDs7vFNy3m/xDuUPHTBR77t94yHZx8wZ1dKgfjg1Z/d1n/7lbPU8+P4/K6PmY7dlTV9UknnDeljev74g7OVo+L3U+PS/Sl1HaJWU98vDXUVsZHs0wMAAklA8QY0gDbqc5vi3Wd2D4/V5ZmdnxqiJ7oulbFStdtvy87gC4+YAknzBBoBwQ4pBhegMF9uIbTT3p8l0qZJBtyQAbR7n+DyN5x/LKodq1ltRnepN+yyo5h9kax8kTXdbIR62Jn9FgaPiV+uMLIqXT/hwrLNayKZ9wjislFG07csRbs8bDxdqY9vxhZuICIiAiIgIiIJm4JfCdxH89+hTqwHZKPaPiXwlN6JV/wCCXwncR/PfoU6sB2Sj2j4l8JTeiQUZU1aMcSeoGmlqp7FT9w3ixQE9qoq2MgwgkkiORuzhuTvs7mHkAUKogmrNc10Nzqslu1wwHI8QusxL5nWKthngkeT0uMUjWAeP2PL59+tc9RM0KpKttRU1eod2ia7m7l7ipKMPA8RkE0h2PQDs0HbfZRsiCbdUeIi/ZLh0WB4naKbD8RhgFMKKlldJNLEBtySSnbdp8YAG+55i7dQkv0p4ZqidkFPE+WWRwaxjGlznE9QAHWVIWMaGau5Hym2YBegx/sZKuHuVhHlDpi0EII5UuaI8QOeaWRi32+eK62Pm3NtrSSxm++5jcDvGTvv0bjygrxdX9H8x0qprNNl0dDC+79v7RDT1HbXs7V2vm59hyj99btsT1FR6gvfZONvBpqfmvWIZHRTbewo3Q1LflOfGf7F42Z8btvbTPjw3C6qWc7hk92maxjfITHGSXe9zj31SlEHT6kZ7lWoeQuvmWXWWvquXkiaQGxwM335I2DoaPe6+s7lcwiICIiCYdC9bK/TTBs0xqNtRIL1Ru+xr4wP8lrCO1mQ7kbDkO+43PNGzo23UPIiAiIg/1pLXBzSQQdwR1hWQ0g4uc2xGigtOU0bMqt0IDWSyzGKrY3yds2Ift/GG/wDGVbkQX4p+NjTh1HzVGMZXHU8v73HFTvZvt1cxlB238fL8SjvUvjSvtyo5qHBMdjsvbG8or62QTzN87IwORp98v95VLRB9d4uVwvF0qbpda2etrqqQyz1E7y98jj1kk9JK/fGKu0UN+pKu/WiS8W2J/NUUUdWaZ07dj63tga4t6djuB4vjXmogt/YuNK3WOzUlntGkUVHQUcTYaeCK/bNjY0bAD/J1HWvmvOK6uW1rrlpb3BfKeExUV0jvpc6FpO/K5ghaJG7kkAkbEnYjc7wKiApq4etaMY0jjkro9Nfs1kMrXRSXSS8mLaMu35GR9pcGdGwJ3JO3iHQoVRBcau43aauop6Ks0nZPTVEbopon37dr2OGzmkdz9IIJCqpm1wx+6ZDPW4xj0uPW2QAsoJK81faj49pHNaSPICCR5SvERARe1jOJZTk8va8cxy73hwdynuKjkmDT5y0EDr8alHG+FvWm88r34xFa4ndUlfWRR/8AxBLx8lBCiL6brRy2651dvncx0tLM+F5YSWlzXFp238W4XzINP+MHwbcx/JovTxrMBaf8YPg25j+TRenjWYCAiIgIiICIiAiIgIiICIiAiIgIiICIiAtLeEHTeLTTSCGpubGwXi8tbcLk+TZphby7xxEnqDGEk79TnPVM+ELTvvhay2+GrgbLaLRtcbgHDdr2sI5Iz5eZ5aCP4PN5FbHjr1J/cdpWcat9RyXfJeamHKfXR0o27c7+kCGecPdt1IKd8TGpUuqGqtwvcMjzaKY9yWuM9HLAwnZ+3iLzu8/ygPEF3/Y+8VF71rlv08XNT2CgknaSNx26T7UwfJdIR52hVyV/ux24yLXpHcskkj5Zr3cXBjtvZQwDkb/8zMgivsjeWGvz+xYfBJvDaaI1U4H/AI056j7zGNI/llVVXa67ZOcx1hynIxJ2yKquMgp3b77ws+1xf/BjVxSAiIgIiICIiCZuCXwncR/PfoU6sB2Sj2j4l8JTeiVf+CXwncR/PfoU6sB2Sj2j4l8JTeiQUZREQEREH02yvrbXcKe422sqKKsppBJBUQSGOSJ46Q5rh0gjyhaDcDGpmT6g4TeqXK699xrLRVRsiq5GgSPikaSGuI9kQWO6T07Eb7rPBXa7Gj/2Dm35VSf4ZUHw9k0/1ff7y/6VUzVzOyaf6vv95f8ASqmaCZNK+G3UrUXFRk1ohtlDbpebuV9wqHRuqeU7EsDWOO2+43dsDselRnmmM3vDsnrcbyKhfRXOifyTROIPWAQQR0FpBBBHQQQr9cNWuumkujdhtV3ya1WC5WS3R0dVS1szYC7tTQwPZzbB/MAHbN3O5PQqkcWme2TUXWWuvmOntlsgp4qOGoLC01HJvvJsQCAS4gb9OwHvIIkREQEREBERAX9RRvllZFExz5HuDWtaNy4nqAHjK/lexg95Zjua2PIJaYVUdsuNPWOgPVKIpGvLfj5dvjQTDLwmawR4l9n+4LY+YRdtNrbVk1gG2+3Ly8hd/FD99+jbdQO4Fri1wIIOxB6wtQpuIfR6PETkgza2vi7Xzto2v/ywu235O0ezB8W5G2/j26Vmbk9yF5yW6XhsDacV1ZNUiJvVHzvLuUe9vsg85EWimh/D9pDU6Y4pkFdhtNX3K42ajrKmWqqJZWulkhY9xDC/kA3cegBBnWikDiNttvs+uOW2u1UVPQ0NNcHRwU9PGGRxtAGwa0dACj9AREQEREBERB3mkGq+ZaZXqGqx68VMVvNQ2Wst5dzU9SOgODmHoDi0bcw2I6OnoWrixnWzCDH/ADf26Xz4RqPSOXjr2M39ul8+Eaj0jl46DT/jB8G3MfyaL08azAWn/GD4NuY/k0Xp41mAgIiICIiAiIgIiICIiAiIgIiICIiAiLrNHsQmz3U2wYnCH8lwrGtnczrZA310rh5wxrj8SC93AtgP7kNGob3VwclzyR4rpCR65tOARA33uUl//uKnPFPqC7UXWW73SnnMlqon9wW0b7t7TGSOceZ7uZ/l2cB4lebipzGDTbQS6PtvJS1NVC20WyNnrRG6Rpbu3yckYe4edoWYqAtMoj3p+D9rmfaKq14zzDxbVcrN/TSLPTSiw/uo1NxnHiznjuF0p4JRtv8AazIOckeQN5j8SvJ2Qm/G2aGRWmOTZ94usMD2b+yjjDpSfeDmR/1hBnoiIgIiICIiAiIgmbgl8J3Efz36FOrAdko9o+JfCU3olX/gl8J3Efz36FOrAdko9o+JfCU3okFGURdRpdgt/wBRsypMWxynElXUbufI87RwRDbmkefE0bjzkkAbkgIOXXRWXBc3vcLZrNh2RXKJw3a+ktk0zSOjpBa0+Uf1q9cWnOlHDXpnVZlcbVFf7xSNAZWVrGumnqHdDI4WkFsQJ36QC4N3JLtlTPUvWTUPP7vPW3rJK6KmkcTFQUs7oqaFvia1jTsdh0cx3J8ZQczkGI5XjzS6/wCMXq0gEAmuoJYB09Xs2jyhW/7Gj/2Dm35VSf4ZVWjTXWXP8FuUUtBfaqvt24bUWuvldPSVEfUWFjiQNx0bt2K0H4eGafXXE353gFmgs8WRtjkr6WAcrIqiLma5vIPWtILiDygBw2dt07kIB7Jp/q+/3l/0qpmrmdk0/wBX3+8v+lVTcKvFvsOSUt0umPUOQUkJPbKCse9scu4IG5YQQQekdY6OkFB48bHySNjjY573EBrWjcknqAC+q62q52mWKG622soJJYxLGypgdEXsJIDgHAbjdpG/VuD5Fp9w612AZPp3bctwrELVjzKjnjlp6eliZJDI1xa9pe1o5urffxggnbqVTuyO/dvs3824PpNSgrMiKbOFXQ2o1cyCorLnNNR4xbHtFZNH0STyHpEMZPQDt0l3TsCPGQghy3UFdcqttJbqKprKh/sYoInSPd7zQCSukk0y1Jjpe6pNPctZTkA9tdZqgM2PUd+TZWm4r84otE7TbNMtJqGlxqqrKbumvrKJgFQ2HctY3tnS4vcWuJeTzAAbHpVSaDMsuoLs27UeT3qCva7nFSyukEm/lLt9z8aDx6qnqKSofT1UEsE0Z2fHIwtc0+Qg9IX245Yb1kl1jtWP2mtutdJ0sp6SF0ryPGdmjoA8Z6gr1aCXzFuJbTKstOpFjoLhkNm5YKirbEI5nMeD2ueN7dixxLXBwb63dvVs7ZcRkNzuHC5qhjWO2yljpcDrpGz19zFOyetubd9pRK8t9b2rmbsyPbo2O+7yAFdM10h1LwyzC85Nh9xt9v5g11QQ17GE9A5ywnk3PR67bp6Fwq0d4hta9LDopkNLRZVZb7V3i2TUlHRUdS2eQySsLWue1pJjDeYO9dyn1uw6VSfQzNcOw7IDLmmAWzK6CaRnM6o3dJTNG4JYx28b+sHZw8XQQg4O3UFdcqoUtuoqmsncNxFBE6R5+IAlfnWU1RR1c1HWU8tPUwSOjmhlYWPje07Oa5p6QQQQQepbAY1b7DQ2uF2O2+30VDPG2SMUdO2JjmkbtIDQBtsVlbrt92/PP5yXH6TIg4xay6E/cQwP+bdu+jRrLrDs2y7Du6v3K5Hc7N3Zyd0dx1Do+28nNy823XtzO298rU3RyurLnpDhtyuFTLVVlXYKGeonldzPlkfTsc5zj4ySSSfOgzd4pfCFzX4Tf/cFGisBxFasamWXW/LbVac5v9DQ01wfHBTw1j2sjbsOgAHoCifLdQs5y63xW/J8ru94pIpRNHDV1TpGNkAIDgCevZxG/nKDl0RWU0o4fsji0rk1NqMSjye6TxslslgmlDY3RHp7pmbuDINulsII5gRvvvsggLH8YyXIXFtgx673ZwOxFDRSTkHyesBX037B81x+nNTfsQyC1QAbmStts0Df63tAXs3bVfU2orW8+Y3u29zPIipKGodRQUxB9iyGLlYzY+IAK4nBTrXdNRqG44Vmc7K+8UFN26CqkYOarptwxwkHUXNLmjfb1wd09IJIUCRWm46dFrThtTR55idAyitVxqDT19HC3lip5yC5r2NHsWvAduB0Agbey2FWUBbMLGdbMIMf839ul8+Eaj0jl469jN/bpfPhGo9I5eOg0/4wfBtzH8mi9PGswFp/xg+DbmP5NF6eNZgICIiAiIgIiICIiAiIgIiICIiAiIgK3nY4MNbU37Ic7qYt20UTbdRk9I7ZJs+UjyENDB70hVQ1pxwi41FhnDxYO6mtglroHXare7o/ffXtJ8m0QjH9FBW3siuZm6aiWrCqeXenslL2+oaD/wDkT7HY+9GGEfyyqsrpNUMmlzPUW/5TLzD7JV8s8bSelkZceRvxNDR8S5tBOvAnZfsvxFWqpcwujtVJU1rx4v3sxNJ950rT7+yknsld57Zf8Ox5rwO56WorZG+Xtj2saT/+p/8AWV+fY1bR23Kcwvxb/otFT0jXEf8Aivc8gH/2Rv8AEuD4+bqbhxD1tIXbi2W6lpQPJuwzbf8AG/tQQCiIgIiICIiAiIgmbgl8J3Efz36FOrAdko9o+JfCU3olX/gl8J3Efz36FOrAdko9o+JfCU3okFGVoL2P7Baaw6TPzCeBv2SyGdzmyFvrmU0TixjR5N3B7vOC3yBZ9LV7h6pIqLQnBYYRs11go5T0ffSQte7+1xQVp7JTkM3dGI4nG8iEMmuM7d+hztxHGfiAl+UqbqzfZHXvOtdljL3FjcchIbv0Ampqdzt8Q/qCrIgK8/Y2LlUTYLldpe9xgpblFPGCehpljIdt/wDqCowrtdjR/wCwc2/KqT/DKg+Hsmn+r7/eX/SqmauZ2TT/AFff7y/6VUzQaL8APg9U/wAJ1X97VAPZHfu32b+bcH0mpU/cAPg9U/wnVf3tUA9kd+7fZv5twfSalBWZaccGtoo7Rw6Yv3KxofWxy1lQ8db5Hyu6T7zQ1vvNCzHWgHY/tQKO+aXuweonY26WCR5jjc710tNI8vDx4zyvc5p8g5PKgrZxxVMs/EvksUh3bTRUcUfX0NNLE/8AveVCSsj2QjF6q1a0Q5H2o9x3ygic2UN6DLEO1vbv5Q0Rn+kFW5BaHsb9XKzV6/0DT9pmsD5nD+MyohDf7JHKZ+yG2ulq9DqW4ytAqKC7wuhdt07Pa9rm+8dwf6IUd9jZxipN0ynMpYXMpmwR22CQt6JHOcJJAD/F5I9/5QX8dkP1LobhPbdNLTUsndRTiuuro3bhkvKWxRHzhr3OI87PGOgKfIiINfcA9omP/BlN6Jqy112+7fnn85Lj9JkWpWAe0TH/AIMpvRNWWuu33b88/nJcfpMiDjFrLoT9xDA/5t276NGsmlrLoT9xDA/5t276NGgzl4pfCFzX4Tf/AHBRopL4pfCFzX4Tf/cFGiAtKMD4jdJZdM7ddK7JqK1VFNQsbU2x4Pb4pGMALGMA3eNx60t6CNurqGa6/wBAJIAG5KD39SL7T5RqDkOSUtIKSnulyqKuKDxsbJI5wB8+x6fPupP4GayWl4lcdgjOzauGshk6etoppJP72NXK43onqVercbs7HX2e0NbzyXG8zMoKdjf4RdMW7jzgFSpwm4viNh4h8YDc/pL3e2iqEdLaqGV9NuaSbm5qiTk6m7n1jHgnYbjrAWl4wLXDduHPLYpWFzqemjqoyG7lro5WP3/qBB8xKzBWrHEj9wTOPgSp/wABWU6AtmFjOtmEGP8Am/t0vnwjUekcvHXsZv7dL58I1HpHLx0Gn/GD4NuY/k0Xp41mAtP+MHwbcx/JovTxrMBAREQEREBERAREQEREBERAREQEREHrYbZZsky6z49Tkia510NGwjxGR4Zv/atLeJ29wYTw55K+j2g/+nC2UjGnYt7btCA3+S1xP9FUl4J7GL3xF4857C+G3NnrpNh1ckTgw/LcxWD7JHfe5dPcZx1rtnXC5vqnbHrZBHy7e9vM0/EgomiIgvn2N62do0uyK7lnK6rvPaASOlzYoWEHq6RvI7x+Xq8dVuKO4fZPiEzap5g7kuklP0Hf96Ai/wD4K7HAfQdx8ONoqOUN7urKuffYdO0zo9+j/wBPbp8iz/1OrTctScnuJdzGqvFXPvvvvzTPd1+PrQc6iIgIiICIiAiIgmbgl8J3Efz36FOrAdko9o+JfCU3olX/AIJfCdxH89+hTqwHZKPaPiXwlN6JBRlai8Jl6ivvDziFRHIHupqLuKQdO7XQuMex38zQfeIWXStt2PjVGmtF2rdNbzU9qhucvdVqe93rRUbAPi994DSPO0+NwQfx2Si2SRZviV5LPtdTbZaUO26zFLzEf8Yf1qpi0o40dN6rUHSGSW0U757zY5e7qWJg3dMzYiWMeUlvrgB0ksA8azYIIJBGxCD/ABXa7Gj/ANg5t+VUn+GVUlWhPAFhtXjGlVXdbmztFZf6hlZFA47PFIGlsL3DrAeRKR5RsQg4Lsmn+r7/AHl/0qpmrmdk0/1ff7y/6VUzQaL8APg9U/wnVf3tUA9kd+7fZv5twfSalT/wBgjh6piQQDc6ojz+uCgHsjoPftsrtjscbgAPi/0mpQVlUzaA4Lf4bbWawT5JU4fjeOuJdc6dgfU1MnQ3tMDHbNdzFzWEu9bu7bZ3SBDK0gyfSRuYcJNkwHG6qCjnjttHVUj3/vU0waJHc5A6nlzzuOou36epBAeV8TmJaiY/Pi+pWndVXWoSNfSVdHXtbWQuaNhJ7Bre2bE78uzTuRy7KJ4YtBYrh3RJX6kVVIHbijNBRROcP4JmEzvP0iPp8y9Ot4aNbqWqfAcGqJeQ7B8VZTvY4eUESf8A+r8fU4a2/iDXfpEH10HYZDxQXG24bDhWk+M02E2WnYY2Tdu7oqyCSS4OIAa525JcQ52/SHAqvVRNNUTyVFRK+aaVxfJI9xc57idyST0kk+NSdWcPOtFLF2yXT+6Ob5InRyH+priVwGR49fsbrzQZDZbjaaodPaa2mfC8jygOA3HnQeYiIg19wD2iY/8ABlN6Jqy112+7fnn85Lj9JkWpeBAtwawNcCCLZTAg9Y+1NWWuvALdcM8DgQf3SXA9P5TIg4tay6E/cQwP+bdu+jRrJpancLt2jvPD7hVVHIHiK1x0junfYwbwkfFyIM/OKXwhc1+E3/3BRop2448Prsb12ud2kp3tt1+aytpJdvWudyNbK3fyh4J28jm+VRHh+M3XKrnLQWqJhMFNLV1M0h5YqeGNhc+SR33rQBt5yQB0kIPo02w+7Z7m9sxOyMaay4S8ge72MTAC58jvM1oJPvdHStA7Hprpfw76c3HMXWplzr7VS9umuVW0OqJpegNZHvuIuZ5a0cvlG5PWqzdj0dRDXucVW3bnWSoFLvt++c8RO39DtitvxaYvc8u0CyS02aGSormMiqooIxu6XtUrZHNA8Z5Wu2HjOwQZ66wap5fqjkElzyS4yOp2vJpLfG4inpWnqDG+XboLj64+MrreCXwncR/PfoU6hoggkEbEKwXAljFwrNbLXlj+WmtVqM0RnlGzZ6iWnljZAw+N+znP28QYfKEF1eJH7gmcfAlT/gKynWsmu1sq7xovmVsoIjLVT2WqbDGOt7u1uIaPOdth76yioqKsrpXxUVJPVSMifM9sMZeWsY0ue8gdTWtBJPUACSg/BbMLGhoLnBrQSSdgB1lbLoMf839ul8+Eaj0jl469nOQW5tfWuBBFyqAQesfbHLxkGn/GD4NuY/k0Xp41mAtP+MHwbcx/JovTxrMBAREQEREBERAREQEREBERAREQEREFruxtWoTahZRei3fuS1MpgfJ22UO//pXy9kfupqNVMfs4duyiswmI8j5Zng/2RtXc9jToRHjWZ3Ll6Z6ylg32PT2tkjuv/wBxQnx0VzqviSv0BJIo6ekgb7xp2Sf3vKCDkREGofCpAy08NmIGUFkbbc6pd6zbofI+Qnb+lv5+tZgVEz6ioknlO8kjy9x223JO5WoenRbbOFSxTtlLBFhkU/bD96TRh5PxbrLhAREQEREBERAREQTNwS+E7iP579CnVgOyUe0fEvhKb0Sr/wAEvhO4j+e/Qp1YDslHtHxL4Sm9Egoyv7hkkhmZNDI+ORjg5j2HZzSOkEEdRX8Igtroxxj3Gz0ENo1JtlTeYomhjLpR8oqdh1dsY4hrz/GBafLuelfpqJceELUOtqb/AFV6vWMXacmSY0NBMwzvO+5cztT49yekkcu5O5O+6qMiCbZ8g0Eweo7rw3Hb9nF3i6YKjI3sioIn+J/aIwHS7fwX7DxqSOFriIsdkumZXXVO/wBW243eWmlp5W0r5GFsYe3tTGxg8gaHDYbAbedVKRBcPiE180K1LsdNZ7nj2W3N1JKZqaqpu1Uroi4bOAc9zj0jbcFhHQFVCn/c9JlINR9lKXH3VZJDO1zVcdNzdA3PIx8gb4/WgnxAdC8tEF3tOeKXRLAsMt2KWDG83ZQUDC1hkpaVz3uc4uc9x7eN3FxJPv8ARsFH3EtrDorq/aoaptrza35FbqeVlvqO5aYRSEjdsc324nk59ju0bjc9B6lWJEBXz4aNaDi+ilo767fsFaoeWjsdznc5z7hE3oAbC0F/LG3Yds25dthvv11q4SdN6XUvV+ktt1i7bZ7dE64V8Z6pWMc0NjPmc9zQfHtzL6ONC6V9dxB36gqmuhpbU2CioKYdDIYBCxwDW9QBLi7o/hIL70Gsmk1bAJodSMUY0+Ke6wwu+S9wP9i+jvsaWe6Xhnz7TfXWTSINa6PU7TWtqG01HqFiVTM87NjivNO9zveAfuv91TwTH9SMKrMdvtLDNFPE401QWBz6aUj1ssZ8RB8nWNweglZJq7HARnNzoNMc3lya4yvxvG2w1FK+Z2/aQWSuljYT4tmRkN8Rd0eyQUvuVJNb7jU0FRy9uppXwycp3HM0kHY++F0mlc2n9NlEdXqNDfqm0QgPbTWmOJz53hw9Y8yPbswjffbp8XR1rnbxWuuV2rLi9gY6qnfM5oO4Bc4u2/tXyoL/ADONPSpjGsZj2ZNa0bACipgAPJ/pCq9xI5ZpVnWRVGW4RRZTb71X1DX19PcIIG0rhykOkYWSOcHkhm46ju47jqMRIgKwnClxEHSmKoxvI6KpuGNVMxnYafYzUkpADi0OIDmHYbt3GxG46yDXtEGi2R8R/DpkePOpsguEV2p3euNvrLHNMeby7OjLAenr5vjVXNb9bLJfLLUYXpbidJiGK1Dw6uMNNHDUXEtO7e2cnUwH73dxOw6duhQYiD2cIya8YblduyawVPc1xt8wlhftuD4i1w8bXAlpHjBKvNp7xkae3W3RNzCjuGO3AACYshdU0zj43Nczd4Hj2LejylUARBdLUzVThMra+a9HDBk10e7m5qS3PpWzP/hSF5jB38ZLXHzFQJm+uWR3nKrFcseoKDF7RjlS2pstnoYwKeB4PsngACRx6iSANiQANzvFCINDMD4wNMLtZIpcolrcdubWfb4HUslRE5+3T2t8YcSCermDT/eq/wCvutOntfBdrbpHh9NaJr210V5vbqRsE1RE4gviiaDu1rz7MnYu6ejp3Vc0Qd3opcdN7Plkd31HpMhrqWifHNSUlqjic2aRp32lL3tIb0Doadz077eO4nq1dLPwBmf6HTftCoAiCSuIC/aZ5Tl0+S6fUmSUE1yqJKi40tzhhbE2RxBLoiyRx9c4uJaegb9HR0CNURBp/wAYPg25j+TRenjWYC2FlhsmV43G2roqS62e4wMl7TV04kimjcA9vMx42PiOxC5/vT6We5phnzFTfUQZNItZe9PpZ7mmGfMVN9RO9PpZ7mmGfMVN9RBk0i1l70+lnuaYZ8xU31E70+lnuaYZ8xU31EGTSLWXvT6We5phnzFTfUTvT6We5phnzFTfUQZNItZe9PpZ7mmGfMVN9RO9PpZ7mmGfMVN9RBk0i1l70+lnuaYZ8xU31E70+lnuaYZ8xU31EGTSLWXvT6We5phnzFTfUTvT6We5phnzFTfUQZNItZe9PpZ7mmGfMVN9RO9PpZ7mmGfMVN9RBk0i1l70+lnuaYZ8xU31E70+lnuaYZ8xU31EEJ9jggDdHb7U83TJkEkfLt1ctPAd/wD5f2KrXFtMZ+IzM3lhZtWtZsT/AAYmN3+Pbf41pjjePWDGqF9DjljtlmpJJTM+CgpGU8bnkAF5awAF2zWjfr2A8iy94k7pTXnXjMrhRymWB10kja4tLd+TZh6D52lBHiIiDUsADhY2A2Awj/oVlotadLJrRkGj+NvggjqbXWWSnjME0e7XxmENcxzXdY6wQeg+dfn3p9LPc0wz5ipvqIMmkWsven0s9zTDPmKm+onen0s9zTDPmKm+ogyaRay96fSz3NMM+Yqb6id6fSz3NMM+Yqb6iDJpFrL3p9LPc0wz5ipvqJ3p9LPc0wz5ipvqIMmkWsven0s9zTDPmKm+onen0s9zTDPmKm+ogoBwS+E7iP579CnVgOyUe0fEvhKb0SsZZNPcBsd0hulkwfGbZXwc3aqqjtUEMsfM0tPK9rQRu0kHY9RIVZuyVXOjFjxCzdsd3Y6pnquTlOwjDWt336us9XmQUmREQEREBERAREQEREFkex8ZTb7HrFWWa4SMi+zlAaeme47bzscHtZ/SaH/GAPGph419Brtm00OeYZSd13ingENwoWezqo2+xfGPG9oJBb1uAG3SNjRGmnmpqiKppppIZ4nh8ckbi1zHA7hwI6QQendWc0y4yczsNDFb8ws9Nk8UYDW1TZe5qnYDb1xDS1/v8oJ6dyUFZq6kqqCslo66mmpamFxZLDNGWPY4dYLT0g++vwVyMu4odGMvow7KNI6i7VYaWtNTDTvLR1bNlJ529HkH61E2R6v6aRSPdhuhGMUcvMS2e7TPrR1bb9p6Gj3iXDzII3wTBcgzKolNsp44LfTeurbpWP7TRUbPG6WU+tb0eLpcfECu31J1CtFs09p9I9Op5ZMdhm7ou91fH2uS81XR67l62xN5WhrT0kNbv1dPD5rneU5g6Nl7ubn0cBJpqCnjbBSU48kcLAGN8m4G58ZK5lAREQEREBERAREQEREBERAREQEREBERB//Z";

const CATEGORIES = {
  "Fine Jewellery":      { avgRoas: 2.4, avgCvr: 0.6,  avgAov: 780, returnRate: 12, resaleable: 85 },
  "Premium Fashion":     { avgRoas: 2.8, avgCvr: 1.1,  avgAov: 320, returnRate: 22, resaleable: 40 },
  "Luxury Homeware":     { avgRoas: 2.6, avgCvr: 0.9,  avgAov: 410, returnRate: 17, resaleable: 60 },
  "Premium Gifting":     { avgRoas: 3.1, avgCvr: 1.4,  avgAov: 195, returnRate: 14, resaleable: 30 },
  "High-End Beauty":     { avgRoas: 3.4, avgCvr: 1.8,  avgAov: 145, returnRate: 8,  resaleable: 20 },
  "Artisan Food & Drink":{ avgRoas: 3.6, avgCvr: 2.1,  avgAov: 95,  returnRate: 5,  resaleable: 0  },
  "Premium Wellness":    { avgRoas: 2.9, avgCvr: 1.2,  avgAov: 260, returnRate: 10, resaleable: 20 },
  "Luxury Pet Products": { avgRoas: 3.2, avgCvr: 1.6,  avgAov: 130, returnRate: 9,  resaleable: 50 },
};

const CURRENCIES = ["£", "$", "€"];

const TOOLTIPS = {
  price:        "The full price your customer pays, including any VAT/tax if applicable.",
  cogs:         "What it costs you to produce or purchase one unit — materials, manufacturing, supplier cost. Exclude shipping.",
  shipping:     "What you actually pay to ship one order out. If you offer free shipping, enter your carrier cost.",
  returnRate:   "The % of orders that come back. We've pre-filled an industry average for your category — adjust to match your reality.",
  returnShip:   "Enter the cost if you cover return postage. Leave at 0 if the customer pays.",
  processFee:   "Stripe/PayPal charge roughly 2.9%. Check your payment provider statement for your exact rate.",
  adSpend:      "Your total monthly spend on Google Ads — not including agency fees, just the raw media spend.",
  reportedRoas: "The ROAS number shown in your Google Ads dashboard. This is what we're stress-testing.",
  vat:          "If your price already includes VAT (most UK/EU retail prices do), toggle this on. We'll strip the VAT before calculating your true revenue.",
  agencyFee:    "If you pay an agency (including us) a % of ad spend, this is a real acquisition cost. Including it gives you the true all-in break-even.",
  resaleable:   "After a return, what % of that stock can you actually resell at full price? Luxury fashion might be 40%, fine jewellery 85%, food 0%.",
  ltv:          "If your customers come back and buy again, your first-order break-even matters less. Enter realistic numbers — this changes the whole picture.",
};

const C = {
  bg:       "#050609",
  bg2:      "#0c0e12",
  pink:     "#EBCFCE",
  pinkDim:  "rgba(235,207,206,0.1)",
  pinkMid:  "rgba(235,207,206,0.22)",
  gray:     "#617073",
  celeste:  "#B9FAF8",
  orange:   "#F26419",
  white:    "#FFFFFF",
  text:     "#E8E4E0",
  textDim:  "#9A9590",
  textFaint:"#5A5655",
  line:     "rgba(235,207,206,0.1)",
};

const f2 = n => isFinite(n) ? n.toFixed(2) : "0.00";
const f0 = n => isFinite(n) ? Math.abs(n).toFixed(0) : "0";

function useAnimatedValue(target, duration = 550) {
  const [val, setVal] = useState(target);
  const prev = useRef(target);
  const raf  = useRef(null);
  useEffect(() => {
    const start = prev.current, end = target, t0 = performance.now();
    const tick = now => {
      const p = Math.min((now - t0) / duration, 1);
      const e = 1 - Math.pow(1 - p, 3);
      setVal(start + (end - start) * e);
      if (p < 1) raf.current = requestAnimationFrame(tick);
      else prev.current = target;
    };
    raf.current = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf.current);
  }, [target, duration]);
  return val;
}

function Tooltip({ text }) {
  const [open, setOpen] = useState(false);
  return (
    <span style={{ position:"relative", display:"inline-flex", alignItems:"center", marginLeft:5 }}>
      <span
        onMouseEnter={() => setOpen(true)} onMouseLeave={() => setOpen(false)}
        onClick={() => setOpen(v => !v)}
        style={{ display:"inline-flex", alignItems:"center", justifyContent:"center",
          width:15, height:15, borderRadius:"50%",
          border:`1px solid rgba(235,207,206,0.25)`,
          color:"rgba(235,207,206,0.45)", fontSize:"0.6rem",
          cursor:"help", flexShrink:0, userSelect:"none", fontWeight:600 }}>?</span>
      {open && (
        <span style={{ position:"absolute", bottom:"calc(100% + 6px)", left:"50%",
          transform:"translateX(-50%)", width:220, padding:"9px 11px",
          background:"#1a1d20", border:`1px solid ${C.line}`,
          borderRadius:3, fontSize:"0.72rem", color:C.textDim,
          lineHeight:1.55, zIndex:100, pointerEvents:"none",
          fontWeight:400,
          boxShadow:"0 8px 24px rgba(0,0,0,0.6)" }}>{text}</span>
      )}
    </span>
  );
}

function Field({ label, tooltip, children }) {
  return (
    <div style={{ marginBottom:"1.2rem" }}>
      <div style={{ display:"flex", alignItems:"center", marginBottom:"0.38rem" }}>
        <label style={{ fontSize:"0.7rem", letterSpacing:"0.1em", textTransform:"uppercase",
          color:C.textDim, fontFamily:"var(--font-sans)", fontWeight:500 }}>{label}</label>
        {tooltip && <Tooltip text={tooltip} />}
      </div>
      {children}
    </div>
  );
}

function NumberInput({ value, onChange, prefix, suffix, step="1", min=0, max }) {
  return (
    <div style={{ position:"relative", display:"flex", alignItems:"center" }}>
      {prefix && <span style={{ position:"absolute", left:"0.85rem", color:C.pink,
        fontFamily:"var(--font-serif)", fontSize:"1rem", pointerEvents:"none", zIndex:1, fontWeight:500 }}>{prefix}</span>}
      <input type="number" value={value} min={min} max={max} step={step}
        onChange={e => onChange(parseFloat(e.target.value) || 0)}
        style={{ width:"100%", background:"rgba(255,255,255,0.03)",
          border:`1px solid rgba(235,207,206,0.15)`, borderRadius:2, outline:"none",
          transition:"border-color .2s, background .2s",
          padding: prefix ? "0.65rem 0.85rem 0.65rem 1.9rem" : suffix ? "0.65rem 2.6rem 0.65rem 0.85rem" : "0.65rem 0.85rem",
          color:C.text, fontFamily:"var(--font-serif)", fontSize:"1.05rem",
          fontWeight:400,
          WebkitAppearance:"none", MozAppearance:"textfield" }}
        onFocus={e => { e.target.style.borderColor="rgba(235,207,206,.4)"; e.target.style.background="rgba(235,207,206,.04)"; }}
        onBlur={e =>  { e.target.style.borderColor="rgba(235,207,206,.15)"; e.target.style.background="rgba(255,255,255,.03)"; }}
      />
      {suffix && <span style={{ position:"absolute", right:"0.85rem", color:C.textDim,
        fontFamily:"var(--font-sans)", fontSize:"0.78rem", pointerEvents:"none", fontWeight:400 }}>{suffix}</span>}
    </div>
  );
}

function Toggle({ value, onChange }) {
  return (
    <button onClick={() => onChange(!value)} style={{ background:"none", border:"none", cursor:"pointer", padding:0 }}>
      <span style={{ width:34, height:19, borderRadius:10, flexShrink:0,
        background: value ? C.pinkMid : "rgba(255,255,255,0.06)",
        border:`1px solid ${value ? "rgba(235,207,206,0.4)" : "rgba(255,255,255,0.1)"}`,
        position:"relative", transition:"all .2s", display:"block" }}>
        <span style={{ position:"absolute", top:2, left: value ? 15 : 2,
          width:13, height:13, borderRadius:"50%",
          background: value ? C.pink : "#4a4848",
          transition:"left .2s, background .2s" }} />
      </span>
    </button>
  );
}

function SectionDivider({ title }) {
  return (
    <div style={{ display:"flex", alignItems:"center", gap:8, marginBottom:"1.1rem", marginTop:"1.6rem" }}>
      <span style={{ fontSize:"0.65rem", letterSpacing:"0.14em", textTransform:"uppercase", color:C.textFaint, fontWeight:500 }}>{title}</span>
      <div style={{ flex:1, height:1, background:C.line }} />
    </div>
  );
}

function MetricCard({ label, value, sub, tone="neutral", large=false, topLine=false }) {
  const colors = { neutral:C.pink, success:C.celeste, danger:C.orange };
  const c = colors[tone] || C.pink;
  return (
    <div style={{ padding: large ? "1.4rem" : "1rem 1.1rem",
      border:`1px solid ${topLine ? "rgba(235,207,206,0.18)" : "rgba(255,255,255,.06)"}`,
      borderRadius:2, background: topLine ? C.pinkDim : "rgba(255,255,255,.02)",
      position:"relative", overflow:"hidden" }}>
      {topLine && <div style={{ position:"absolute",top:0,left:0,right:0,height:1,
        background:`linear-gradient(90deg,transparent,${C.pink},transparent)` }}/>}
      <div style={{ fontSize:"0.65rem", letterSpacing:"0.12em", textTransform:"uppercase",
        color:C.textFaint, marginBottom:"0.35rem", fontFamily:"var(--font-sans)", fontWeight:500 }}>{label}</div>
      <div style={{ fontSize: large ? "2.2rem" : "1.55rem", fontFamily:"var(--font-serif)",
        fontWeight:400, color:c, lineHeight:1, letterSpacing:"-0.02em" }}>{value}</div>
      {sub && <div style={{ fontSize:"0.68rem", color:C.textFaint, marginTop:"0.3rem",
        lineHeight:1.4, fontWeight:400 }}>{sub}</div>}
    </div>
  );
}

function RoasGauge({ current, breakEven, target }) {
  const max = Math.max(current*1.4, target*1.2, breakEven*1.6, 6);
  const pct = n => `${Math.min(Math.max((n/max)*100,0),100)}%`;
  const isOk = current >= breakEven;
  return (
    <div>
      <div style={{ height:6, background:"rgba(255,255,255,.05)", borderRadius:3, position:"relative", marginBottom:"0.65rem" }}>
        <div style={{ height:"100%", width:pct(current), borderRadius:3,
          transition:"width .55s cubic-bezier(.16,1,.3,1)",
          background: isOk ? `linear-gradient(90deg,${C.pink},${C.celeste})` : `linear-gradient(90deg,#6b2020,${C.orange})` }} />
        <div style={{ position:"absolute",top:-4,left:pct(breakEven),width:2,height:14,
          background:C.pink,transform:"translateX(-50%)",borderRadius:1,opacity:.8 }} />
        <div style={{ position:"absolute",top:-2,left:pct(target),width:1,height:10,
          background:C.celeste,transform:"translateX(-50%)",borderRadius:1,opacity:.6 }} />
      </div>
      <div style={{ display:"flex",justifyContent:"space-between",fontSize:"0.65rem",
        color:C.textFaint,letterSpacing:"0.06em",fontWeight:400 }}>
        <span>0x</span>
        <span style={{ color:"rgba(235,207,206,0.65)" }}>break-even {f2(breakEven)}x</span>
        <span style={{ color:"rgba(185,250,248,0.55)" }}>target {f2(target)}x</span>
        <span>{f2(max)}x</span>
      </div>
    </div>
  );
}

function CostBar({ items, price }) {
  return (
    <div style={{ display:"flex",flexDirection:"column",gap:"0.5rem" }}>
      {items.map(({ label, val, color }) => {
        const pct = Math.min((val/price)*100, 100);
        return (
          <div key={label} style={{ display:"flex",alignItems:"center",gap:"0.8rem" }}>
            <div style={{ fontSize:"0.7rem",color:C.textDim,width:175,flexShrink:0,fontWeight:400 }}>{label}</div>
            <div style={{ flex:1,height:3,background:"rgba(255,255,255,.04)",borderRadius:2 }}>
              <div style={{ height:"100%",width:`${pct}%`,background:color,borderRadius:2,
                opacity:.75,transition:"width .6s cubic-bezier(.16,1,.3,1)" }} />
            </div>
            <div style={{ fontSize:"0.73rem",color:C.textDim,width:55,textAlign:"right",
              fontFamily:"var(--font-serif)",fontWeight:400 }}>£{f0(val)}</div>
            <div style={{ fontSize:"0.65rem",color:C.textFaint,width:38,textAlign:"right",fontWeight:400 }}>{pct.toFixed(1)}%</div>
          </div>
        );
      })}
    </div>
  );
}

export default function ROASCalculator() {
  const [currency,     setCurrency]      = useState("£");
  const [category,     setCategory]      = useState("Fine Jewellery");
  const cat                               = CATEGORIES[category];
  const [price,        setPrice]         = useState(450);
  const [cogs,         setCogs]          = useState(135);
  const [shipping,     setShipping]      = useState(8);
  const [returnRate,   setReturnRate]    = useState(cat.returnRate);
  const [retShip,      setRetShip]       = useState(0);
  const [processFee,   setProcessFee]    = useState(2.9);
  const [adSpend,      setAdSpend]       = useState(2000);
  const [reportedRoas, setReportedRoas]  = useState(3.2);
  const [vatOn,        setVatOn]         = useState(false);
  const [advanced,     setAdvanced]      = useState(false);
  const [agencyFee,    setAgencyFee]     = useState(12);
  const [resalePct,    setResalePct]     = useState(cat.resaleable);
  const [ltvOn,        setLtvOn]         = useState(false);
  const [purchPerYear, setPurchPerYear]  = useState(1.8);
  const [yearsRetain,  setYearsRetain]   = useState(2);

  useEffect(() => {
    setReturnRate(CATEGORIES[category].returnRate);
    setResalePct(CATEGORIES[category].resaleable);
  }, [category]);

  // Auto-resize: tell parent iframe how tall we are whenever content changes
  useEffect(() => {
    const sendHeight = () => {
      const h = document.documentElement.scrollHeight;
      window.parent.postMessage({ type: "roas-calc-height", height: h }, "*");
    };
    sendHeight();
    const ro = new ResizeObserver(sendHeight);
    ro.observe(document.body);
    return () => ro.disconnect();
  });

  const netPrice           = vatOn ? price / 1.2 : price;
  const processCost        = (netPrice * processFee) / 100;
  const unrecoverableCogs  = cogs * (1 - (advanced ? resalePct : cat.resaleable) / 100);
  const returnCostPerOrder = (returnRate / 100) * (retShip + unrecoverableCogs);
  const totalVarCost       = cogs + shipping + processCost + returnCostPerOrder;
  const grossProfit        = netPrice - totalVarCost;
  const grossMarginPct     = netPrice > 0 ? (grossProfit / netPrice) * 100 : 0;
  const breakEvenRoas      = grossMarginPct > 0 ? (100 / grossMarginPct) : 999;
  const totalAdCost        = advanced ? adSpend * (1 + agencyFee / 100) : adSpend;
  const currentRevenue     = Math.max(adSpend * reportedRoas, 0.01);
  const currentOrders      = currentRevenue / (price > 0 ? price : 1);
  const adCostPerOrder     = totalAdCost / (currentOrders > 0 ? currentOrders : 0.01);
  const trueProfit         = currentRevenue - totalAdCost - (currentOrders * totalVarCost);
  const profitPerOrder     = currentOrders > 0 ? trueProfit / currentOrders : 0;
  const isProfitable       = trueProfit > 0;
  const trueBreakEven      = advanced && agencyFee > 0 ? breakEvenRoas * (1 + agencyFee / 100) : breakEvenRoas;
  const targetRoas         = trueBreakEven * 1.3;
  const stretchRoas        = trueBreakEven * 1.6;
  const gap                = reportedRoas - trueBreakEven;
  const ltv                = ltvOn ? price * purchPerYear * yearsRetain : null;
  const ltvProfit          = ltv ? ltv * (grossMarginPct / 100) : null;
  const maxCacForLtv       = ltvProfit ? ltvProfit / 3 : null;
  const ltvAdjBreak        = (maxCacForLtv && maxCacForLtv > 0) ? price / maxCacForLtv : null;

  const verdict = isProfitable
    ? gap > 0.6
      ? { label:"Profitable — Room to Scale",  color:C.celeste, text:`At a ${f2(reportedRoas)}x ROAS you're generating ${currency}${f0(Math.abs(profitPerOrder))} true profit per order. The ${f2(gap)}x buffer above break-even gives you room to scale strategically.` }
      : { label:"Profitable — Watch Closely",  color:C.pink,    text:`You're in profit but the margin of safety is thin at ${f2(gap)}x above break-even. One bad month of returns or a rising CPC could tip you negative.` }
    : { label:"Currently Loss-Making",         color:C.orange,  text:`Despite a reported ROAS of ${f2(reportedRoas)}x, once all costs are included your actual break-even is ${f2(trueBreakEven)}x. You are losing ${currency}${f0(Math.abs(profitPerOrder))} on every ad-driven order.` };

  const animBreakEven = useAnimatedValue(isFinite(trueBreakEven) ? trueBreakEven : 0);
  const animProfit    = useAnimatedValue(isFinite(profitPerOrder) ? profitPerOrder : 0);
  const animMonthly   = useAnimatedValue(isFinite(trueProfit) ? trueProfit : 0);
  const animMargin    = useAnimatedValue(isFinite(grossMarginPct) ? grossMarginPct : 0);
  const animLtv       = useAnimatedValue(ltv ?? 0);
  const animLtvBreak  = useAnimatedValue(ltvAdjBreak ?? 0);

  const costBars = [
    { label:"Cost of Goods (COGS)",    val:cogs,                color:C.gray },
    { label:"Outbound Shipping",       val:shipping,            color:"#4a6063" },
    { label:"Payment Processing",      val:processCost,         color:"#3a5053" },
    { label:"Returns Allowance",       val:returnCostPerOrder,  color:"#2a4043" },
    { label:"Ad Spend per Order",      val:adCostPerOrder,      color:C.pink },
    ...(advanced && agencyFee > 0 ? [{ label:"Agency Fee per Order", val:adCostPerOrder*(agencyFee/100), color:"rgba(235,207,206,0.45)" }] : []),
  ];

  return (
    <div style={{ minHeight:"100vh", background:C.bg, fontFamily:"var(--font-sans)", color:C.text, position:"relative", overflowX:"hidden" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,500;1,400&family=DM+Sans:wght@300;400;500;600&display=swap');
        :root { --font-serif:'Playfair Display',Georgia,serif; --font-sans:'DM Sans',system-ui,sans-serif; }
        * { box-sizing:border-box; margin:0; padding:0; }
        input::-webkit-outer-spin-button,input::-webkit-inner-spin-button{-webkit-appearance:none;}
        input[type=number]{-moz-appearance:textfield;}
        ::-webkit-scrollbar{width:4px;}
        ::-webkit-scrollbar-track{background:#050609;}
        ::-webkit-scrollbar-thumb{background:#1a1d20;border-radius:2px;}
        select{-webkit-appearance:none;appearance:none;}
        select option{background:#1a1d20;}
        @keyframes fadeUp{from{opacity:0;transform:translateY(12px)}to{opacity:1;transform:translateY(0)}}
        .fade-up{animation:fadeUp .45s cubic-bezier(.16,1,.3,1) both;}
        .fade-up-1{animation-delay:.04s}.fade-up-2{animation-delay:.08s}
        .fade-up-3{animation-delay:.12s}.fade-up-4{animation-delay:.16s}
        .fade-up-5{animation-delay:.20s}.fade-up-6{animation-delay:.24s}
        .adv-body{overflow:hidden;transition:max-height .4s cubic-bezier(.16,1,.3,1),opacity .35s ease;}
        .adv-body.open{max-height:700px;opacity:1;}
        .adv-body.closed{max-height:0;opacity:0;}
        .main-grid{display:grid;grid-template-columns:1fr 1fr;gap:2px;}
        .full-row{grid-column:1/-1;}
        .cta-btn{transition:all .2s!important;}
        .cta-btn:hover{opacity:.88;transform:translateY(-1px)!important;}
        @media(max-width:780px){
          .main-grid{grid-template-columns:1fr;}
          .metrics-grid-3{grid-template-columns:1fr 1fr!important;}
          .metrics-grid-2{grid-template-columns:1fr!important;}
          .strip-grid{grid-template-columns:1fr 1fr!important;}
          .cta-row{flex-direction:column!important;}
          .outer-wrap{padding-left:0.25rem!important;padding-right:0.25rem!important;}
          .inner-pad{padding:1.1rem 0.75rem!important;}
        }
        @media(max-width:480px){
          .metrics-grid-3{grid-template-columns:1fr!important;}
          .strip-grid{grid-template-columns:1fr!important;}
        }
      `}</style>

      <div style={{ position:"fixed",top:"-15%",right:"-8%",width:500,height:500,
        background:"radial-gradient(circle,rgba(235,207,206,.035) 0%,transparent 70%)",
        pointerEvents:"none",zIndex:0 }}/>

      <div className="outer-wrap" style={{ position:"relative",zIndex:1,maxWidth:1100,margin:"0 auto",padding:"0 1.25rem 5rem" }}>

        {/* ── HEADER ── */}
        <header style={{ padding:"2.2rem 0 2rem", borderBottom:`1px solid ${C.line}` }}>
          <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", marginBottom:"1.6rem" }}>
            <img
              src={LOGO_SRC}
              alt="No7. Digital"
              style={{ height:52, width:"auto", display:"block" }}
            />
            <a href="https://no7.digital"
              style={{ fontSize:"0.68rem", color:C.textFaint, letterSpacing:"0.1em",
                textDecoration:"none", textTransform:"uppercase", fontWeight:500,
                transition:"color .2s" }}
              onMouseEnter={e => e.target.style.color=C.pink}
              onMouseLeave={e => e.target.style.color=C.textFaint}>
              no7.digital →
            </a>
          </div>

          <h1 style={{ fontFamily:"var(--font-serif)", fontWeight:400,
            fontSize:"clamp(1.8rem,4.5vw,3rem)", lineHeight:1.1,
            letterSpacing:"-0.01em", marginBottom:"0.7rem",
            background:`linear-gradient(130deg,${C.white} 0%,${C.pink} 60%,rgba(235,207,206,0.5) 100%)`,
            WebkitBackgroundClip:"text", WebkitTextFillColor:"transparent" }}>
            Break-Even ROAS Calculator
          </h1>
          <p style={{ fontSize:"0.97rem", color:C.textDim, maxWidth:540, lineHeight:1.75,
            fontStyle:"italic", fontWeight:300 }}>
            Your Google Ads dashboard reports a ROAS. This calculates the one that actually matters — the number you must beat before you make a single pound of real profit.
          </p>
        </header>

        {/* ── MAIN GRID ── */}
        <div className="main-grid" style={{ marginTop:2 }}>

          {/* LEFT: INPUTS */}
          <div className="inner-pad" style={{ background:"rgba(255,255,255,.012)", padding:"1.8rem",
            borderLeft:`1px solid ${C.line}`, borderBottom:`1px solid ${C.line}` }}>

            <SectionDivider title="Your Product" />

            <Field label="Currency">
              <div style={{ display:"flex", gap:"0.5rem" }}>
                {CURRENCIES.map(c => (
                  <button key={c} onClick={() => setCurrency(c)} style={{
                    flex:1, padding:"0.6rem",
                    background: currency===c ? C.pinkDim : "rgba(255,255,255,.03)",
                    border:`1px solid ${currency===c ? "rgba(235,207,206,.38)" : "rgba(235,207,206,.1)"}`,
                    borderRadius:2, color: currency===c ? C.pink : C.textFaint,
                    cursor:"pointer", fontFamily:"var(--font-serif)", fontSize:"1rem",
                    fontWeight:400, transition:"all .15s" }}>{c}</button>
                ))}
              </div>
            </Field>

            <Field label="Product Category">
              <div style={{ position:"relative" }}>
                <select value={category} onChange={e => setCategory(e.target.value)} style={{
                  width:"100%", background:"rgba(255,255,255,.03)",
                  border:`1px solid rgba(235,207,206,.15)`, borderRadius:2,
                  padding:"0.65rem 2rem 0.65rem 0.85rem", color:C.text,
                  fontFamily:"var(--font-sans)", fontSize:"0.93rem",
                  fontWeight:400, outline:"none", cursor:"pointer" }}>
                  {Object.keys(CATEGORIES).map(k => <option key={k} value={k}>{k}</option>)}
                </select>
                <span style={{ position:"absolute",right:"0.8rem",top:"50%",
                  transform:"translateY(-50%)",color:C.textFaint,
                  fontSize:"0.65rem",pointerEvents:"none" }}>▾</span>
              </div>
            </Field>

            <Field label="VAT / Tax">
              <div style={{ display:"flex",alignItems:"center",justifyContent:"space-between",
                padding:"0.65rem 0.9rem",background:"rgba(255,255,255,.02)",
                border:`1px solid rgba(235,207,206,.08)`,borderRadius:2 }}>
                <span style={{ fontSize:"0.8rem",color:C.textDim,fontWeight:400 }}>Price includes VAT / Sales Tax</span>
                <div style={{ display:"flex",alignItems:"center",gap:8 }}>
                  <Tooltip text={TOOLTIPS.vat} />
                  <Toggle value={vatOn} onChange={setVatOn} />
                </div>
              </div>
            </Field>

            <div style={{ display:"grid",gridTemplateColumns:"1fr 1fr",gap:"0 1rem" }}>
              <Field label="Selling Price" tooltip={TOOLTIPS.price}><NumberInput value={price} onChange={setPrice} prefix={currency} /></Field>
              <Field label="Cost of Goods" tooltip={TOOLTIPS.cogs}><NumberInput value={cogs} onChange={setCogs} prefix={currency} /></Field>
            </div>

            <SectionDivider title="Fulfilment" />

            <div style={{ display:"grid",gridTemplateColumns:"1fr 1fr",gap:"0 1rem" }}>
              <Field label="Outbound Shipping" tooltip={TOOLTIPS.shipping}><NumberInput value={shipping} onChange={setShipping} prefix={currency} /></Field>
              <Field label="Return Rate" tooltip={TOOLTIPS.returnRate}><NumberInput value={returnRate} onChange={setReturnRate} suffix="%" step="0.5" max={100} /></Field>
              <Field label="Return Shipping" tooltip={TOOLTIPS.returnShip}><NumberInput value={retShip} onChange={setRetShip} prefix={currency} /></Field>
              <Field label="Processing Fee" tooltip={TOOLTIPS.processFee}><NumberInput value={processFee} onChange={setProcessFee} suffix="%" step="0.1" /></Field>
            </div>

            <SectionDivider title="Ad Performance" />

            <div style={{ display:"grid",gridTemplateColumns:"1fr 1fr",gap:"0 1rem" }}>
              <Field label="Monthly Ad Spend" tooltip={TOOLTIPS.adSpend}><NumberInput value={adSpend} onChange={setAdSpend} prefix={currency} /></Field>
              <Field label="Reported ROAS" tooltip={TOOLTIPS.reportedRoas}><NumberInput value={reportedRoas} onChange={setReportedRoas} suffix="x" step="0.1" min={0.1} /></Field>
            </div>

            <div style={{ padding:"0.8rem 0.9rem",background:"rgba(235,207,206,.025)",
              border:`1px solid rgba(235,207,206,.07)`,borderRadius:2,marginTop:"0.2rem" }}>
              <p style={{ fontSize:"0.72rem",color:C.textFaint,lineHeight:1.6,fontWeight:400 }}>
                This is the number in your Google Ads dashboard — not your real profitability. That's what we calculate on the right.
              </p>
            </div>

            {/* Advanced */}
            <div style={{ marginTop:"1.6rem" }}>
              <button onClick={() => setAdvanced(v => !v)} style={{
                width:"100%",display:"flex",alignItems:"center",justifyContent:"space-between",
                padding:"0.85rem 1rem",
                background: advanced ? C.pinkDim : "rgba(255,255,255,.02)",
                border:`1px solid ${advanced ? "rgba(235,207,206,.2)" : "rgba(235,207,206,.08)"}`,
                borderRadius:2,cursor:"pointer",transition:"all .2s",
                color: advanced ? C.pink : C.textFaint }}>
                <div style={{ display:"flex",alignItems:"center",gap:8 }}>
                  <span style={{ fontSize:"0.68rem",letterSpacing:"0.12em",textTransform:"uppercase",
                    fontFamily:"var(--font-sans)",fontWeight:600 }}>Advanced Settings</span>
                  <span style={{ fontSize:"0.65rem",color:advanced?"rgba(235,207,206,.5)":C.textFaint,
                    fontWeight:400 }}>Agency fee · Resale rate · LTV</span>
                </div>
                <span style={{ fontSize:"0.7rem",transition:"transform .3s",display:"block",
                  transform:advanced?"rotate(180deg)":"rotate(0)" }}>▾</span>
              </button>

              <div className={`adv-body ${advanced?"open":"closed"}`}>
                <div style={{ paddingTop:"1.2rem" }}>
                  <SectionDivider title="Agency & Overhead" />
                  <Field label="Agency / Management Fee" tooltip={TOOLTIPS.agencyFee}>
                    <NumberInput value={agencyFee} onChange={setAgencyFee} suffix="% of ad spend" step="0.5" max={50} />
                  </Field>
                  <SectionDivider title="Returns — Resale Rate" />
                  <Field label="Returned Stock You Can Resell" tooltip={TOOLTIPS.resaleable}>
                    <div>
                      <NumberInput value={resalePct} onChange={setResalePct} suffix="% resaleable" step="5" max={100} />
                      <div style={{ fontSize:"0.68rem",color:C.textFaint,marginTop:"0.3rem",fontWeight:400 }}>
                        Category default: {cat.resaleable}%
                      </div>
                    </div>
                  </Field>
                  <SectionDivider title="Customer Lifetime Value" />
                  <div style={{ display:"flex",alignItems:"center",gap:10,marginBottom:"0.9rem" }}>
                    <Toggle value={ltvOn} onChange={setLtvOn} />
                    <span style={{ fontSize:"0.78rem",color:ltvOn?C.pink:C.textFaint,
                      letterSpacing:"0.06em",textTransform:"uppercase",
                      fontFamily:"var(--font-sans)",fontWeight:500,transition:"color .2s" }}>
                      My customers buy more than once
                    </span>
                    <Tooltip text={TOOLTIPS.ltv} />
                  </div>
                  {ltvOn && (
                    <div style={{ display:"grid",gridTemplateColumns:"1fr 1fr",gap:"0 1rem" }}>
                      <Field label="Avg Purchases / Year"><NumberInput value={purchPerYear} onChange={setPurchPerYear} step="0.1" min={1} suffix="× / yr" /></Field>
                      <Field label="Avg Years as Customer"><NumberInput value={yearsRetain} onChange={setYearsRetain} step="0.5" min={0.5} suffix="yrs" /></Field>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* RIGHT: OUTPUTS */}
          <div className="inner-pad" style={{ background:"rgba(255,255,255,.008)", padding:"1.8rem",
            borderRight:`1px solid ${C.line}`, borderBottom:`1px solid ${C.line}` }}>

            {/* Verdict */}
            <div className="fade-up fade-up-1" style={{ padding:"1.1rem 1.3rem",marginBottom:"1.2rem",
              border:`1px solid ${verdict.color}22`,
              borderLeft:`3px solid ${verdict.color}`,
              background:`${verdict.color}08`,borderRadius:2 }}>
              <div style={{ fontSize:"0.63rem",letterSpacing:"0.16em",textTransform:"uppercase",
                color:verdict.color,marginBottom:"0.25rem",opacity:.85,fontWeight:600 }}>Verdict</div>
              <div style={{ fontSize:"1rem",color:verdict.color,marginBottom:"0.35rem",
                fontFamily:"var(--font-serif)",fontWeight:500 }}>{verdict.label}</div>
              <div style={{ fontSize:"0.78rem",color:C.textDim,lineHeight:1.65,fontWeight:400 }}>{verdict.text}</div>
            </div>

            {/* Primary metric */}
            <div className="fade-up fade-up-2" style={{ marginBottom:8 }}>
              <MetricCard large topLine
                label="Your Break-Even ROAS"
                value={`${f2(animBreakEven)}x`}
                sub={`Beat this number before a single pound of profit exists${advanced&&agencyFee>0?` (includes ${agencyFee}% agency fee)`:""}`}
              />
            </div>

            {/* Gauge */}
            <div className="fade-up fade-up-2" style={{ padding:"1rem 1.1rem",
              border:`1px solid rgba(255,255,255,.06)`,borderRadius:2,marginBottom:8,
              background:"rgba(255,255,255,.01)" }}>
              <div style={{ fontSize:"0.63rem",letterSpacing:"0.12em",textTransform:"uppercase",
                color:C.textFaint,marginBottom:"0.7rem",fontWeight:500 }}>ROAS Position</div>
              <RoasGauge current={reportedRoas} breakEven={trueBreakEven} target={targetRoas} />
            </div>

            {/* 3-col metrics */}
            <div className="fade-up fade-up-3 metrics-grid-3" style={{ display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:8,marginBottom:8 }}>
              <MetricCard label="Gross Margin" value={`${f2(animMargin)}%`} sub="After all variable costs" />
              <MetricCard label="Profit per Order"
                value={`${animProfit<0?"-":""}${currency}${f0(animProfit)}`}
                sub={animProfit>=0?"True net per sale":"Loss per sale"}
                tone={animProfit>=0?"success":"danger"} />
              <MetricCard label="Monthly Profit"
                value={`${animMonthly<0?"-":""}${currency}${f0(animMonthly)}`}
                sub={animMonthly>=0?"From ad campaigns":"Currently losing"}
                tone={animMonthly>=0?"success":"danger"} />
            </div>

            {/* Target tiers */}
            <div className="fade-up fade-up-4" style={{ padding:"1rem 1.1rem",
              border:`1px solid rgba(255,255,255,.06)`,borderRadius:2,marginBottom:8,
              background:"rgba(255,255,255,.01)" }}>
              <div style={{ fontSize:"0.63rem",letterSpacing:"0.12em",textTransform:"uppercase",
                color:C.textFaint,marginBottom:"0.8rem",fontWeight:500 }}>Target ROAS Tiers</div>
              {[
                { label:"Break-even", val:trueBreakEven, color:C.orange, desc:"Cover all costs, zero profit" },
                { label:"Healthy",    val:targetRoas,    color:C.pink,   desc:"30% buffer — recommended minimum" },
                { label:"Strong",     val:stretchRoas,   color:C.celeste,desc:"60% buffer — room to scale" },
              ].map(({ label, val, color, desc }) => (
                <div key={label} style={{ display:"flex",alignItems:"center",gap:"0.8rem",marginBottom:"0.55rem" }}>
                  <div style={{ width:7,height:7,borderRadius:"50%",background:color,flexShrink:0 }}/>
                  <div style={{ fontSize:"0.73rem",color:C.textDim,width:80,flexShrink:0,fontWeight:400 }}>{label}</div>
                  <div style={{ fontSize:"1.05rem",color,fontFamily:"var(--font-serif)",width:55,flexShrink:0,fontWeight:400 }}>{f2(val)}x</div>
                  <div style={{ fontSize:"0.68rem",color:C.textFaint,fontWeight:400 }}>{desc}</div>
                </div>
              ))}
            </div>

            {/* Benchmark */}
            <div className="fade-up fade-up-4" style={{ padding:"1rem 1.1rem",
              border:`1px solid rgba(255,255,255,.06)`,borderRadius:2,marginBottom:8,
              background:"rgba(255,255,255,.01)" }}>
              <div style={{ display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:"0.7rem" }}>
                <div style={{ fontSize:"0.63rem",letterSpacing:"0.12em",textTransform:"uppercase",
                  color:C.textFaint,fontWeight:500 }}>vs {category} Benchmark</div>
                {(() => {
                  const diff = reportedRoas - cat.avgRoas;
                  return <span style={{ fontSize:"0.65rem",padding:"0.2rem 0.6rem",borderRadius:2,fontWeight:500,
                    color:diff>=0?C.celeste:C.orange,
                    background:diff>=0?"rgba(185,250,248,.07)":"rgba(242,100,25,.07)",
                    border:`1px solid ${diff>=0?"rgba(185,250,248,.15)":"rgba(242,100,25,.15)"}`}}>
                    {diff>=0?"▲":"▼"} {Math.abs(diff).toFixed(2)}x vs avg
                  </span>;
                })()}
              </div>
              <div style={{ display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:"0.6rem" }}>
                {[{l:"Industry Avg ROAS",v:`${cat.avgRoas}x`},{l:"Typical Conv. Rate",v:`${cat.avgCvr}%`},{l:"Typical AOV",v:`${currency}${cat.avgAov}`}].map(({l,v})=>(
                  <div key={l}>
                    <div style={{ fontSize:"0.63rem",color:C.textFaint,letterSpacing:"0.08em",
                      textTransform:"uppercase",marginBottom:"0.2rem",fontWeight:500 }}>{l}</div>
                    <div style={{ fontSize:"0.97rem",color:C.textDim,fontFamily:"var(--font-serif)",fontWeight:400 }}>{v}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* LTV */}
            {advanced && ltvOn && ltv && (
              <div className="fade-up fade-up-5" style={{ padding:"1.1rem 1.3rem",
                border:`1px solid rgba(235,207,206,.16)`,borderRadius:2,marginBottom:8,
                background:C.pinkDim,position:"relative",overflow:"hidden" }}>
                <div style={{ position:"absolute",top:0,left:0,right:0,height:1,
                  background:`linear-gradient(90deg,transparent,${C.pink},transparent)` }}/>
                <div style={{ fontSize:"0.63rem",letterSpacing:"0.12em",textTransform:"uppercase",
                  color:"rgba(235,207,206,.65)",marginBottom:"0.7rem",fontWeight:500 }}>LTV-Adjusted Acquisition Target</div>
                <div className="metrics-grid-2" style={{ display:"grid",gridTemplateColumns:"1fr 1fr",gap:8 }}>
                  <MetricCard label="Customer LTV" value={`${currency}${f0(animLtv)}`} sub={`${purchPerYear}× / yr over ${yearsRetain} yrs`} />
                  <MetricCard label="LTV-Adjusted ROAS Floor"
                    value={ltvAdjBreak?`${f2(animLtvBreak)}x`:"–"}
                    sub="Min ROAS for LTV profitability"
                    tone={ltvAdjBreak&&ltvAdjBreak<trueBreakEven?"success":"neutral"} />
                </div>
                {ltvAdjBreak && ltvAdjBreak < trueBreakEven && (
                  <p style={{ fontSize:"0.75rem",color:C.textDim,lineHeight:1.65,marginTop:"0.7rem",fontStyle:"italic",fontWeight:300 }}>
                    Because your customers repurchase, you can profitably acquire at as low as {f2(ltvAdjBreak)}x on first order — {f2(trueBreakEven-ltvAdjBreak)}x lower than your single-order break-even.
                  </p>
                )}
              </div>
            )}
          </div>

          {/* COST BREAKDOWN */}
          <div className="full-row fade-up fade-up-5" style={{ padding:"1.5rem 1.8rem",
            background:"rgba(255,255,255,.008)",
            borderBottom:`1px solid ${C.line}`,borderLeft:`1px solid ${C.line}`,borderRight:`1px solid ${C.line}` }}>
            <div className="strip-grid" style={{ display:"grid",gridTemplateColumns:"repeat(4,1fr)",gap:"1.2rem",marginBottom:"1.4rem" }}>
              {[
                {l:"Est. Monthly Orders",  v:`${f0(currentOrders)}`,                       s:"from ads at current ROAS"},
                {l:"True Cost Per Order",  v:`${currency}${f0(adCostPerOrder)}`,            s:"ad spend only, excl. COGS"},
                {l:"Return Cost / Order",  v:`-${currency}${f0(returnCostPerOrder)}`,       s:"unrecoverable stock + shipping"},
                {l:"CAC (all-in)",         v:`${currency}${f0(adCostPerOrder+totalVarCost)}`,s:"full cost of one paid customer"},
              ].map(({l,v,s})=>(
                <div key={l} style={{ borderLeft:`1px solid rgba(235,207,206,.08)`,paddingLeft:"1rem" }}>
                  <div style={{ fontSize:"0.63rem",letterSpacing:"0.1em",textTransform:"uppercase",
                    color:C.textFaint,marginBottom:"0.25rem",fontWeight:500 }}>{l}</div>
                  <div style={{ fontSize:"1.3rem",color:C.pink,fontFamily:"var(--font-serif)",
                    fontWeight:400,letterSpacing:"-0.01em" }}>{v}</div>
                  <div style={{ fontSize:"0.67rem",color:C.textFaint,marginTop:"0.15rem",fontWeight:400 }}>{s}</div>
                </div>
              ))}
            </div>
            <div style={{ fontSize:"0.63rem",letterSpacing:"0.12em",textTransform:"uppercase",
              color:C.textFaint,marginBottom:"0.9rem",fontWeight:500 }}>True Cost per Order — Breakdown</div>
            <CostBar items={costBars} price={netPrice} />
            <div style={{ display:"flex",justifyContent:"flex-end",marginTop:"0.6rem",
              paddingTop:"0.5rem",borderTop:`1px solid rgba(235,207,206,.06)` }}>
              <span style={{ fontSize:"0.7rem",color:C.textFaint,fontWeight:400 }}>Total cost of one sale: </span>
              <span style={{ fontSize:"0.8rem",color:C.pink,fontFamily:"var(--font-serif)",marginLeft:8,fontWeight:400 }}>
                {currency}{f0(totalVarCost+adCostPerOrder)}
                <span style={{ fontSize:"0.65rem",color:C.textFaint,marginLeft:6,fontWeight:400 }}>
                  ({f2((totalVarCost+adCostPerOrder)/(netPrice||1)*100)}% of net revenue)
                </span>
              </span>
            </div>
          </div>

          {/* PLAIN ENGLISH */}
          <div className="full-row fade-up fade-up-6" style={{ padding:"1.6rem 1.8rem",
            background:C.pinkDim,
            borderBottom:`1px solid ${C.line}`,borderLeft:`1px solid ${C.line}`,borderRight:`1px solid ${C.line}` }}>
            <div style={{ maxWidth:640 }}>
              <div style={{ fontSize:"0.63rem",letterSpacing:"0.14em",textTransform:"uppercase",
                color:"rgba(235,207,206,.65)",marginBottom:"0.8rem",fontWeight:500 }}>What This Means For Your Business</div>
              <p style={{ fontSize:"0.97rem",color:C.textDim,lineHeight:1.8,fontStyle:"italic",
                marginBottom:"0.8rem",fontWeight:300 }}>
                {isProfitable
                  ? `At ${f2(reportedRoas)}x ROAS, your campaigns generate ${currency}${f0(Math.abs(profitPerOrder))} real profit per order after all costs. Your healthy target should be ${f2(targetRoas)}x — giving you enough buffer to absorb a bad week without slipping into loss.`
                  : `Despite a reported ROAS of ${f2(reportedRoas)}x, your true break-even is ${f2(trueBreakEven)}x once COGS, shipping, returns, processing${advanced&&agencyFee>0?", and agency fees":""} are accounted for. Every ad-driven order is currently costing you ${currency}${f0(Math.abs(profitPerOrder))}. This is fixable — the first step is knowing the number.`
                }
              </p>
              <p style={{ fontSize:"0.82rem",color:C.textFaint,lineHeight:1.7,fontWeight:400 }}>
                Industry benchmark for {category}: average ROAS {cat.avgRoas}x · typical AOV {currency}{cat.avgAov} · typical conversion rate {cat.avgCvr}%.{" "}
                Your reported ROAS is{" "}
                <span style={{ color:reportedRoas>=cat.avgRoas?C.celeste:C.orange,fontWeight:500 }}>
                  {reportedRoas>=cat.avgRoas?`${f2(reportedRoas-cat.avgRoas)}x above`:`${f2(cat.avgRoas-reportedRoas)}x below`}
                </span>{" "}that benchmark.
              </p>
            </div>
          </div>

          {/* CTA */}
          <div className="full-row cta-row" style={{ padding:"2rem 1.8rem",display:"flex",
            justifyContent:"space-between",alignItems:"center",gap:"1.5rem",
            background:"rgba(255,255,255,.008)",
            borderLeft:`1px solid ${C.line}`,borderRight:`1px solid ${C.line}`,borderBottom:`1px solid ${C.line}` }}>
            <div>
              <div style={{ fontFamily:"var(--font-serif)",fontSize:"1.25rem",fontWeight:400,
                color:C.white,marginBottom:"0.4rem" }}>
                Want to know <em>why</em> your ROAS is where it is?
              </div>
              <div style={{ fontSize:"0.82rem",color:C.textFaint,lineHeight:1.6,fontWeight:400 }}>
                Free 2-minute Google Ads audit from No7. Digital — no account access required.
              </div>
            </div>
            <a href="https://no7.digital/contact" className="cta-btn"
              style={{ padding:"0.95rem 2.2rem",flexShrink:0,
                background:C.pink, border:"none", borderRadius:2, cursor:"pointer",
                color:C.bg, fontFamily:"var(--font-sans)",
                fontSize:"0.85rem", letterSpacing:"0.1em", textTransform:"uppercase",
                fontWeight:700, textDecoration:"none", display:"inline-block",
                boxShadow:`0 4px 24px rgba(235,207,206,.15)` }}>
              Get a Free Audit →
            </a>
          </div>

        </div>

        {/* Footer */}
        <div style={{ marginTop:"2.5rem",display:"flex",justifyContent:"space-between",
          alignItems:"center",flexWrap:"wrap",gap:"1rem",
          paddingTop:"1.2rem",borderTop:`1px solid rgba(235,207,206,.05)` }}>
          <img src={LOGO_SRC} alt="No7. Digital" style={{ height:24, width:"auto" }} />
          <p style={{ fontSize:"0.65rem",color:C.textFaint,letterSpacing:"0.07em",fontWeight:400 }}>
            Calculations are estimates. Actual profitability may vary.
          </p>
        </div>

      </div>
    </div>
  );
}
