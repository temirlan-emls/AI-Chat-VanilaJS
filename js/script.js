const textI = document.querySelector(".inputField form input");
const submitB = document.querySelector(".inputField form button");
const messageF = document.querySelector(".messageField");

submitB.addEventListener("click", (e) => {
    e.preventDefault();

    !textI.value
        ? ((textI.placeholder = "Enter text!!!!"),
          (textI.style.backgroundColor = "rgb(110, 0, 0)"),
          (textI.style.color = "gray"))
        : ((textI.placeholder = "Can you ..."),
          (textI.style.backgroundColor = "rgb(70, 70, 70)"));

    if (textI.value) {
        messageF.childNodes.forEach((element) => {
            if (element.classList == "initMassage") {
                messageF.removeChild(element);
            }
        });

        renderMessage(textI.value, "myMessage", messageF);
        renderMessage("Loading...", "otherMessage", messageF);

        let headers = new Headers();
        headers.append("Content-Type", "application/json;charset=utf-8");
        headers.append(
            "Access-Control-Allow-Origin",
            "https://temirlan-emls.github.io/AI-Chat-VanilaJS/"
        );

        fetch("https://chat-gpt-example.vercel.app/makeRequest", {
            method: "POST",
            crossorigin: true,
            headers: headers,

            body: JSON.stringify({
                question: textI.value,
            }),
        })
            .then((response) => {
                return response.json();
            })
            .then((res) => {
                messageF.childNodes.forEach((element) => {
                    if (element.classList == "otherMessage") {
                        if (
                            element.firstElementChild.innerText == "Loading..."
                        ) {
                            messageF.removeChild(element);
                        }
                    }
                });
                renderMessage(res.answer, "otherMessage", messageF);
            })
            .catch((error) => {
                if (error) {
                    messageF.childNodes.forEach((element) => {
                        if (element.classList == "otherMessage") {
                            if (
                                element.firstElementChild.innerText ==
                                "Loading..."
                            ) {
                                element.firstElementChild.style.backgroundColor =
                                    "red";
                                element.firstElementChild.innerText = `Error \n ${error}`;
                            }
                        }
                    });
                }
            });
    }

    textI.value = "";
});

function renderMessage(payload, type, messagesWrapper) {
    const messageWrapper = document.createElement("div");
    const messagePayload = document.createElement("p");
    const messageTime = document.createElement("p");
    messageWrapper.classList.add(type);
    messagePayload.innerText = payload.trim();
    messageTime.innerText = new Date().toLocaleTimeString("en-US", {
        hour12: false,
        hour: "numeric",
        minute: "numeric",
        second: "numeric",
    });
    messageWrapper.appendChild(messagePayload);
    messageWrapper.appendChild(messageTime);
    messagesWrapper.appendChild(messageWrapper);

    messagesWrapper.scrollTo(0, messagesWrapper.scrollHeight);
}
