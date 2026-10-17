import type { Metadata } from "next";
import Link from "next/link";
import SubscribeForm from "@/components/SubscribeForm";
import { getAllWords } from "@/lib/words";
import { SITE } from "@/lib/site";

// 러시아어 랜딩 페이지. 표현 항목은 아직 영어라서, 여기서는 대표 예시만 러시아어로 보여 주고
// 구독(러시아어 PDF, 뉴스레터는 영어)으로 러시아어권 수요를 확인합니다.
// 발음 표기: 콘체비치 표기(система Концевича)

const TITLE = "Корейский, в котором ошибается ИИ";
const DESCRIPTION =
  "Открытая коллекция корейских фраз, которые ИИ-переводчики передают неправильно, и того, что на самом деле говорят корейцы. Бесплатный чек-лист на русском.";

export const metadata: Metadata = {
  title: { absolute: `${TITLE} | ${SITE.name}` },
  description: DESCRIPTION,
  alternates: { canonical: "/ru", languages: { en: "/", ru: "/ru", "x-default": "/" } },
  openGraph: {
    type: "website",
    siteName: SITE.name,
    title: TITLE,
    description: DESCRIPTION,
    url: "/ru",
    locale: "ru_RU",
    images: [{ url: "/og/default.png", width: 1200, height: 630, alt: TITLE }],
  },
};

type Example = {
  situation: string;
  ai: string;
  fix: string;
  translit: string;
  why: string;
  slug: string;
};

const EXAMPLES: Example[] = [
  {
    situation: "Уходите с работы раньше начальника",
    ai: "수고하세요",
    fix: "먼저 들어가 보겠습니다.",
    translit: "мончжо тырога богессымнида",
    why: "ИИ переводит 수고하세요 как «Хорошей работы». Но «трудитесь дальше» говорит старший младшему — начальнику так сказать снисходительно.",
    slug: "how-to-use-sugohaseyo-correctly",
  },
  {
    situation: "Продавец предлагает пакет, и он вам нужен",
    ai: "괜찮아요",
    fix: "네, 주세요.",
    translit: "не, чусеё",
    why: "ИИ говорит, что 괜찮아요 — это «Хорошо». Но после предложения оно значит «Нет, спасибо». Так иностранцы случайно отказываются.",
    slug: "gwaenchanayo-can-mean-no-thanks",
  },
  {
    situation: "Спрашиваете коллегу, пообедал ли он",
    ai: "당신은 점심 먹었어요?",
    fix: "점심 드셨어요?",
    translit: "чомсим тысёссоё",
    why: "ИИ подставляет 당신 вместо «вы». В разговоре с коллегой это звучит как начало ссоры. Корейцы просто опускают «вы».",
    slug: "why-not-to-say-dangsin-for-you",
  },
  {
    situation: "Руководитель пишет вам в KakaoTalk",
    ai: "네.",
    fix: "넵!",
    translit: "неп",
    why: "Голое 네 с точкой в чате читается холодно, почти раздражённо. 넵 — бодрое рабочее «есть!».",
    slug: "nep-texting-reply-to-boss",
  },
];

export default function RussianPage() {
  const count = getAllWords().length;

  return (
    <div lang="ru">
      {/* Hero */}
      <section className="border-b border-line">
        <div className="mx-auto max-w-6xl px-4 pb-14 pt-12 sm:px-6 sm:pt-20">
          <span className="inline-flex items-center gap-2 rounded-full border border-accent/30 bg-white px-3 py-1 text-xs font-medium text-accent">
            <span className="h-1.5 w-1.5 rounded-full bg-accent" />
            Версия на русском · бета
          </span>

          <h1 className="mt-6 max-w-3xl text-4xl font-semibold leading-[1.1] tracking-tight sm:text-5xl">
            Корейский, в котором ошибается ИИ.
          </h1>

          <div className="mt-6 grid max-w-3xl gap-4 text-lg leading-relaxed text-muted sm:grid-cols-2">
            <p>
              Корейский — язык <strong className="text-ink">отношений</strong>. Кто перед вами — старше или
              младше, начальник или незнакомец — меняет сами слова.
            </p>
            <p>
              ИИ-переводчики переводят слово в слово и этого не видят. Мы собираем фразы, в которых они
              ошибаются, и то, что на самом деле говорят корейцы.
            </p>
          </div>
        </div>
      </section>

      {/* Examples */}
      <section className="mx-auto max-w-6xl px-4 py-12 sm:px-6" aria-labelledby="examples">
        <h2 id="examples" className="text-2xl font-semibold tracking-tight">
          Четыре ошибки, которые ИИ делает каждый день
        </h2>
        <ul className="mt-6 grid gap-4 sm:grid-cols-2">
          {EXAMPLES.map((e) => (
            <li key={e.slug} className="rounded-2xl border border-line bg-white p-6">
              <p className="text-sm text-muted">{e.situation}</p>
              <p className="mt-3 font-serif text-lg text-muted line-through decoration-accent decoration-2" lang="ko">
                {e.ai}
              </p>
              <p className="mt-1 font-serif text-2xl font-bold" lang="ko">
                {e.fix}
              </p>
              <p className="mt-1 text-sm text-muted">{e.translit}</p>
              <p className="mt-3 leading-relaxed">{e.why}</p>
              <Link
                href={`/words/${e.slug}`}
                hrefLang="en"
                className="mt-3 inline-block text-sm text-accent underline"
              >
                Подробнее (на английском)
              </Link>
            </li>
          ))}
        </ul>
      </section>

      {/* Subscribe */}
      <section className="mx-auto max-w-6xl px-4 pb-12 sm:px-6" aria-label="Подписка">
        <SubscribeForm source="/ru" lang="ru" />
      </section>

      {/* About the Russian version */}
      <section className="mx-auto max-w-6xl px-4 pb-16 sm:px-6">
        <div className="max-w-2xl space-y-4 leading-relaxed">
          <h2 className="text-xl font-semibold tracking-tight">Почему на русском</h2>
          <p>
            Почти все материалы по корейскому — на английском. Проект ведёт носитель корейского, который
            изучал русский язык и литературу и жил в Бишкеке. Поэтому мы начинаем русскую версию.
          </p>
          <p>
            Сейчас на русском есть чек-лист. Рассылка и все {count} статей пока доступны{" "}
            <Link href="/" hrefLang="en" className="text-accent underline">
              на английском
            </Link>
            . Чем больше будет подписчиков, тем быстрее мы переведём остальное.
          </p>
          <p className="text-muted">
            Встретили странный корейский перевод от ИИ? Напишите на{" "}
            <a href={`mailto:${SITE.contactEmail}`} className="text-accent underline">
              {SITE.contactEmail}
            </a>{" "}
            — можно по-русски. Возможно, ваш случай станет следующей статьёй.
          </p>
        </div>
      </section>
    </div>
  );
}
