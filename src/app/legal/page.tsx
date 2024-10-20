"use client";
import { useState } from "react";

export default function Legal() {
  const [language, setLanguage] = useState<"en" | "jp" | "cn">("en");

  const handleLanguageChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setLanguage(event.target.value as "en" | "jp" | "cn");
  };

  const getContent = () => {
    const content = {
      en: {
        title: "Terms of Use and Privacy Policy",
        sections: [
          { title: "Acceptance of Terms", items: ["By using this website, you agree to these terms.", "If you do not agree, please discontinue the use of the site."] },
          { title: "User Responsibilities", items: ["Users are responsible for the content they share on the website."] },
          { title: "Information Collection", items: ["We do not collect or store any personal user information.", "There is no tracking of user activity or data collection on the website.", "This website does not use cookies at all. No tracking or data storage related to cookies occurs."] },
          { title: "Content Ownership", items: ["All illustrations on the website are sourced from storyset.com and used in accordance with their licensing."] },
          { title: "Security", items: ["Since anyone who knows the URL can access and edit the note, be cautious when sharing sensitive information.", "The website is designed for quick and casual note-sharing rather than highly secure content."] },
        ],
      },
      jp: {
        title: "利用規約およびプライバシーポリシー",
        sections: [
          { title: "規約への同意", items: ["このウェブサイトを利用することにより、これらの規約に同意するものとします。", "同意しない場合は、サイトの利用を中止してください。"] },
          { title: "ユーザーの責任", items: ["ユーザーは、ウェブサイト上で共有するコンテンツに責任を負います。"] },
          { title: "情報の収集", items: ["個人ユーザー情報を収集または保存しません。", "ウェブサイトでの活動追跡やデータ収集は行っていません。", "本ウェブサイトではクッキーを一切使用していません。クッキーによる追跡やデータ保存はありません。"] },
          { title: "コンテンツの所有権", items: ["ウェブサイト上のすべてのイラストはstoryset.comから取得し、ライセンスに従って使用しています。"] },
          { title: "セキュリティ", items: ["URLを知っている人なら誰でもノートにアクセスして編集できるため、機密情報の共有には注意してください。", "このサイトは高度なセキュリティが必要なコンテンツではなく、簡易なノート共有を目的としています。"] },
        ],
      },
      cn: {
        title: "使用条款和隐私政策",
        sections: [
          { title: "条款接受", items: ["使用本网站即表示您同意这些条款。", "如果您不同意，请停止使用本网站。"] },
          { title: "用户责任", items: ["用户对其在网站上分享的内容负责。"] },
          { title: "信息收集", items: ["我们不收集或存储任何个人用户信息。", "网站上没有用户活动或数据收集的跟踪。", "本网站完全不使用Cookie。没有与Cookie相关的跟踪或数据存储。"] },
          { title: "内容所有权", items: ["网站上的所有插图均来自 storyset.com, 并根据其许可使用。"] },
          { title: "安全", items: ["由于任何知道URL的人都可以访问和编辑笔记, 共享敏感信息时请谨慎。", "本网站旨在用于快速和随意的笔记共享，而非高度安全的内容。"] },
        ],
      },
    };
    return content[language];
  };

  const content = getContent();

  return (
    <>
      <div className="md:w-full md:max-w-md mx-4 md:mx-auto">
        <div className="flex flex-col items-center">
          <div className="mt-16 mb-8 flex flex-col w-full">
            <h1 className="text-4xl font-bold text-center">{content.title}</h1>
            <div className="ml-auto mt-4">
              <select
                value={language}
                onChange={handleLanguageChange}
                className="px-4 py-2 rounded-lg border bg-gray-50 outline-none focus:ring-2 ring-offset-2 focus:ring-primary duration-200"
              >
                <option value="en">English</option>
                <option value="cn">中文</option>
                <option value="jp">日本語</option>
              </select>
            </div>
          </div>
          <div className="w-full space-y-4">
            {content.sections.map((section, index) => (
              <div key={index} className="p-8 rounded-2xl border shadow-inner">
                <h2 className="text-2xl font-bold mb-2">{section.title}</h2>
                <ul className="list-disc ml-8">
                  {section.items.map((item, i) => (
                    <li key={i}>{item}</li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
        <div className="text-center my-8">
          <p>&copy; m1ng.jp All Rights Reserved.</p>
        </div>
      </div>
    </>
  );
}