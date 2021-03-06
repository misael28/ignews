import { GetStaticPaths, GetStaticProps } from "next";
import { RichText } from "prismic-dom";
import { getPrismicClient } from "../../../services/prismic";
import Head from "next/head";
import Link from "next/link";
import styles from "../../posts/post.module.scss";
import { useSession } from "next-auth/client";
import { useEffect } from "react";
import { useRouter } from "next/router";

interface PreviewProps {
  post: {
    slug: string;
    title: string;
    content: string;
    updatedAt: string;
  };
}

export default function Preview({ post }: PreviewProps) {
  const [session] = useSession();
  const router = useRouter();

  useEffect(() => {
    if (session?.activeSubscription) {
      router.push(`/posts/${post.slug}`);
    }
  }, [session]);

  return (
    <>
      <Head>
        <title>{post.title} | Ignews</title>
      </Head>
      <main className={styles.container}>
        <article className={styles.post}>
          <h1>{post.title}</h1>
          <time>{post.updatedAt}</time>
          <div
            className={`${styles.postContent} ${styles.previewContent}`}
            dangerouslySetInnerHTML={{ __html: post.content }}
          />
          <div className={styles.continueReading}>
            Wanna continue reading?
            <Link href="/">
              <a href="">Subscribe now! 🤗</a>
            </Link>
          </div>
        </article>
      </main>
    </>
  );
}

export const getStaticPaths: GetStaticPaths = async () => {
  return {
    paths: [
      {
        params: {
          slug: "posts/preview/como-renomear-varios-arquivos-de-uma-vez-usando-o-terminal",
        },
      },
    ],
    fallback: "blocking",
  };
};

export const getStaticProps: GetStaticProps = async ({ params }) => {
  const { slug } = params;

  const prismic = getPrismicClient();

  const response = await prismic.getByUID("publication", String(slug), {});

  const post = {
    slug,
    title: RichText.asText(response.data.title),
    content: RichText.asHtml(response.data.content.splice(0, 3)),
    excerpt:
      response.data.content.find((content) => content.type === "paragraph")
        ?.text ?? "",
    updatedAt: new Date(response.last_publication_date).toLocaleDateString(
      "pt-br",
      {
        day: "2-digit",
        month: "long",
        year: "numeric",
      }
    ),
  };

  return {
    props: {
      post,
    },
  };
};
