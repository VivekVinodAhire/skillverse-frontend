import {
  useEffect,
  useRef,
  useState,
} from "react";

import {
  ArrowUp,
  BookOpen,
  BrainCircuit,
  Check,
  Copy,
  Lightbulb,
  LoaderCircle,
  Paperclip,
  RotateCcw,
  Sparkles,
} from "lucide-react";

import {
  sendTutorMessage,
} from "../services/aiTutorService";

import {
  getCurrentUserId,
} from "../services/courseService";

const suggestedQuestions = [
  "Explain React hooks with a simple example",
  "Create a 7-day Java learning plan",
  "What is the difference between API and REST API?",
  "Help me understand binary search",
];

const createWelcomeMessage = () => ({
  id: crypto.randomUUID(),
  type: "assistant",
  text:
    "Hello! I am your SkillVerse AI Tutor. Ask me about your courses, lessons, programming concepts, study plans or any difficult topic.",
});

function AITutor() {
  const [
    message,
    setMessage,
  ] = useState("");

  const [
    messages,
    setMessages,
  ] = useState(() => {
    try {
      const storedMessages =
        sessionStorage.getItem(
          "skillverseTutorMessages"
        );

      if (storedMessages) {
        const parsedMessages =
          JSON.parse(
            storedMessages
          );

        if (
          Array.isArray(
            parsedMessages
          ) &&
          parsedMessages.length >
            0
        ) {
          return parsedMessages;
        }
      }
    } catch (error) {
      console.error(
        "Tutor history error:",
        error
      );
    }

    return [
      createWelcomeMessage(),
    ];
  });

  const [
    isSending,
    setIsSending,
  ] = useState(false);

  const [
    error,
    setError,
  ] = useState("");

  const [
    copiedMessageId,
    setCopiedMessageId,
  ] = useState(null);

  const messagesEndRef =
    useRef(null);

  useEffect(() => {
    sessionStorage.setItem(
      "skillverseTutorMessages",
      JSON.stringify(
        messages
      )
    );

    messagesEndRef.current?.scrollIntoView(
      {
        behavior: "smooth",
      }
    );
  }, [messages]);

  const sendMessage =
    async (
      selectedMessage
    ) => {
      const question =
        String(
          selectedMessage ??
            message
        ).trim();

      if (
        !question ||
        isSending
      ) {
        return;
      }

      const userId =
        getCurrentUserId();

      if (!userId) {
        setError(
          "Your login session is invalid. Please log in again."
        );

        return;
      }

      const userMessage = {
        id:
          crypto.randomUUID(),

        type: "user",

        text:
          question,
      };

      const updatedMessages = [
        ...messages,
        userMessage,
      ];

      setMessages(
        updatedMessages
      );

      setMessage("");
      setError("");
      setIsSending(true);

      try {
        const chatHistory =
          updatedMessages
            .slice(-10)
            .map(
              (
                chatMessage
              ) => ({
                role:
                  chatMessage.type ===
                  "user"
                    ? "user"
                    : "assistant",

                text:
                  chatMessage.text,
              })
            );

        const response =
          await sendTutorMessage({
            userId,
            message:
              question,
            history:
              chatHistory,
          });

        const assistantText =
          response.answer ||
          response.data
            ?.answer ||
          response.message;

        if (!assistantText) {
          throw new Error(
            "The AI Tutor did not return an answer."
          );
        }

        setMessages(
          (
            currentMessages
          ) => [
            ...currentMessages,

            {
              id:
                crypto.randomUUID(),

              type:
                "assistant",

              text:
                assistantText,
            },
          ]
        );
      } catch (
        requestError
      ) {
        console.error(
          "AI Tutor Error:",
          requestError
        );

        const errorMessage =
          requestError.response
            ?.data?.message ||
          requestError.message ||
          "The AI Tutor could not answer your question.";

        setError(
          errorMessage
        );

        setMessages(
          (
            currentMessages
          ) => [
            ...currentMessages,

            {
              id:
                crypto.randomUUID(),

              type:
                "assistant",

              text:
                "I could not generate an answer right now. Please wait a moment and try again.",
            },
          ]
        );
      } finally {
        setIsSending(false);
      }
    };

  const startNewConversation =
    () => {
      const newMessages = [
        {
          id:
            crypto.randomUUID(),

          type:
            "assistant",

          text:
            "New conversation started. What would you like to learn?",
        },
      ];

      setMessages(
        newMessages
      );

      setMessage("");
      setError("");

      sessionStorage.setItem(
        "skillverseTutorMessages",
        JSON.stringify(
          newMessages
        )
      );
    };

  const copyMessage =
    async (
      chatMessage
    ) => {
      try {
        await navigator.clipboard.writeText(
          chatMessage.text
        );

        setCopiedMessageId(
          chatMessage.id
        );

        window.setTimeout(
          () => {
            setCopiedMessageId(
              null
            );
          },
          1800
        );
      } catch (copyError) {
        console.error(
          "Copy failed:",
          copyError
        );
      }
    };

  return (
    <div className="ai-tutor-page">
      <section className="ai-tutor-sidebar-panel">
        <div>
          <span className="ai-tutor-panel-icon">
            <BrainCircuit
              size={25}
            />
          </span>

          <h1>
            AI Tutor
          </h1>

          <p>
            Your personal learning
            assistant, available
            whenever you need help.
          </p>
        </div>

        <button
          type="button"
          className="new-ai-chat-button"
          onClick={
            startNewConversation
          }
          disabled={
            isSending
          }
        >
          <RotateCcw
            size={16}
          />

          New conversation
        </button>

        <div className="ai-tutor-capabilities">
          <h3>
            AI capabilities
          </h3>

          <div>
            <Lightbulb
              size={17}
            />

            Explain difficult
            concepts
          </div>

          <div>
            <BookOpen
              size={17}
            />

            Create study notes
          </div>

          <div>
            <Sparkles
              size={17}
            />

            Generate learning plans
          </div>
        </div>
      </section>

      <section className="ai-chat-area">
        <header className="ai-chat-header">
          <div>
            <span>
              <BrainCircuit
                size={21}
              />
            </span>

            <div>
              <strong>
                SkillVerse AI Tutor
              </strong>

              <small>
                <i />

                Online · Gemini AI
              </small>
            </div>
          </div>
        </header>

        <div className="ai-chat-messages">
          {messages.map(
            (
              chatMessage
            ) => (
              <article
                key={
                  chatMessage.id
                }
                className={`ai-chat-message ${chatMessage.type}`}
              >
                {chatMessage.type ===
                  "assistant" && (
                  <span className="ai-message-avatar">
                    <BrainCircuit
                      size={18}
                    />
                  </span>
                )}

                <div>
                  <p>
                    {
                      chatMessage.text
                    }
                  </p>

                  {chatMessage.type ===
                    "assistant" && (
                    <button
                      type="button"
                      onClick={() =>
                        copyMessage(
                          chatMessage
                        )
                      }
                    >
                      {copiedMessageId ===
                      chatMessage.id ? (
                        <>
                          <Check
                            size={14}
                          />
                          Copied
                        </>
                      ) : (
                        <>
                          <Copy
                            size={14}
                          />
                          Copy
                        </>
                      )}
                    </button>
                  )}
                </div>
              </article>
            )
          )}

          {isSending && (
            <article className="ai-chat-message assistant">
              <span className="ai-message-avatar">
                <BrainCircuit
                  size={18}
                />
              </span>

              <div className="ai-tutor-typing-message">
                <LoaderCircle
                  size={18}
                  className="spin-icon"
                />

                <p>
                  SkillVerse AI is
                  preparing your
                  answer...
                </p>
              </div>
            </article>
          )}

          <div
            ref={
              messagesEndRef
            }
          />
        </div>

        {messages.length === 1 &&
          !isSending && (
            <div className="ai-suggestion-grid">
              {suggestedQuestions.map(
                (
                  question
                ) => (
                  <button
                    type="button"
                    key={
                      question
                    }
                    onClick={() =>
                      sendMessage(
                        question
                      )
                    }
                  >
                    <Sparkles
                      size={15}
                    />

                    {question}
                  </button>
                )
              )}
            </div>
          )}

        {error && (
          <div className="ai-tutor-error-message">
            {error}
          </div>
        )}

        <div className="ai-message-composer">
          <button
            type="button"
            aria-label="Attach file"
            disabled
            title="File upload will be available later"
          >
            <Paperclip
              size={19}
            />
          </button>

          <textarea
            value={
              message
            }
            onChange={(
              event
            ) =>
              setMessage(
                event.target.value
              )
            }
            onKeyDown={(
              event
            ) => {
              if (
                event.key ===
                  "Enter" &&
                !event.shiftKey
              ) {
                event.preventDefault();

                sendMessage();
              }
            }}
            placeholder="Ask anything about your course..."
            disabled={
              isSending
            }
            maxLength={3000}
          />

          <button
            type="button"
            className="ai-send-button"
            onClick={() =>
              sendMessage()
            }
            disabled={
              isSending ||
              !message.trim()
            }
          >
            {isSending ? (
              <LoaderCircle
                size={19}
                className="spin-icon"
              />
            ) : (
              <ArrowUp
                size={19}
              />
            )}
          </button>
        </div>

        <p className="ai-chat-disclaimer">
          AI responses may contain
          mistakes. Always verify
          important information.
        </p>
      </section>
    </div>
  );
}

export default AITutor;