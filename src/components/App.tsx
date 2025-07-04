import { CSSProperties, useRef } from "react";
import styles from '../styles/index.module.scss';
import { defaultArticleState } from "src/constants/articleProps";
import { ArticleParamsForm } from "./article-params-form/ArticleParamsForm";
import { Article } from "./article/Article";

export const App = () => {
	const mainRef = useRef<HTMLDivElement>(null);
	return (
		<main
			ref={mainRef}
			className={styles.main}
			style={
				{
					'--font-family': defaultArticleState.fontFamilyOption.value,
					'--font-size': defaultArticleState.fontSizeOption.value,
					'--font-color': defaultArticleState.fontColor.value,
					'--container-width': defaultArticleState.contentWidth.value,
					'--bg-color': defaultArticleState.backgroundColor.value,
				} as CSSProperties
			}>
			<ArticleParamsForm 
				mainRef={mainRef} 
			/>
			<Article />
		</main>
	);
};