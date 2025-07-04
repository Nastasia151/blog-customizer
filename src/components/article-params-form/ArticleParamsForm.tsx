import { ArrowButton } from 'src/ui/arrow-button';
import { Button } from 'src/ui/button';
import { RadioGroup } from 'src/ui/radio-group';
import { Select } from 'src/ui/select/Select';
import { Separator } from 'src/ui/separator';

import {
	defaultArticleState,
	fontFamilyOptions,
	fontColors,
	backgroundColors,
	contentWidthArr,
	fontSizeOptions,
	OptionType,
	ArticleStateType,
} from 'src/constants/articleProps';

import styles from './ArticleParamsForm.module.scss';
import { useState, useEffect, useRef } from 'react';
import { useOutsideClickClose } from 'src/ui/select/hooks/useOutsideClickClose';
import clsx from 'clsx';

type ArticleParamsFormProps = {
	mainRef: React.RefObject<HTMLDivElement>;
};

export const ArticleParamsForm = ({ mainRef }: ArticleParamsFormProps) => {
	const [isOpen, setIsOpen] = useState(false);

	const [initialState] = useState<ArticleStateType>(defaultArticleState);
	const [draftState, setDraftState] =
		useState<ArticleStateType>(defaultArticleState);

	useEffect(() => {
		if (isOpen && mainRef.current) {
			setDraftState({
				fontFamilyOption: getCurrentOption(fontFamilyOptions, '--font-family'),
				fontColor: getCurrentOption(fontColors, '--font-color'),
				backgroundColor: getCurrentOption(backgroundColors, '--bg-color'),
				contentWidth: getCurrentOption(contentWidthArr, '--container-width'),
				fontSizeOption: getCurrentOption(fontSizeOptions, '--font-size'),
			});
		}
	}, [isOpen]);

	function getCurrentOption(options: OptionType[], cssVar: string): OptionType {
		if (!mainRef.current) return options[0];
		const value =
			mainRef.current.style.getPropertyValue(cssVar) ||
			getComputedStyle(mainRef.current).getPropertyValue(cssVar);
		return options.find((opt) => opt.value === value.trim()) || options[0];
	}

	const handleApply = (e: React.FormEvent) => {
		e.preventDefault();
		setCssVars(draftState);
		setIsOpen(false);
	};

	const handleReset = (e: React.FormEvent) => {
		e.preventDefault();
		setDraftState(initialState);
		setCssVars(initialState);
		setIsOpen(false);
	};

	function setCssVars(state: ArticleStateType) {
		if (!mainRef.current) return;
		mainRef.current.style.setProperty(
			'--font-family',
			state.fontFamilyOption.value
		);
		mainRef.current.style.setProperty(
			'--font-size',
			state.fontSizeOption.value
		);
		mainRef.current.style.setProperty('--font-color', state.fontColor.value);
		mainRef.current.style.setProperty(
			'--container-width',
			state.contentWidth.value
		);
		mainRef.current.style.setProperty(
			'--bg-color',
			state.backgroundColor.value
		);
	}

	const handleChange = (field: keyof ArticleStateType, value: OptionType) => {
		setDraftState((prev) => ({ ...prev, [field]: value }));
	};

	const rootRef = useRef<HTMLDivElement>(null);
	useOutsideClickClose({
		isOpen,
		rootRef,
		onClose: () => setIsOpen(false),
		onChange: () => setIsOpen(false),
	});

	return (
		<>
			<ArrowButton isOpen={isOpen} onClick={() => setIsOpen(!isOpen)} />
			<aside
				className={clsx(styles.container, { [styles.container_open]: isOpen })}
				ref={rootRef}>
				<form
					className={styles.form}
					onSubmit={handleApply}
					onReset={handleReset}>
					<h2 className={styles.title}>Задайте параметры</h2>
					<Select
						options={fontFamilyOptions}
						selected={draftState.fontFamilyOption}
						onChange={(opt) => handleChange('fontFamilyOption', opt)}
						title='Шрифт'
					/>
					<RadioGroup
						name='fontSize'
						options={fontSizeOptions}
						selected={draftState.fontSizeOption}
						onChange={(opt) => handleChange('fontSizeOption', opt)}
						title='Размер шрифта'
					/>
					<Select
						options={fontColors}
						selected={draftState.fontColor}
						onChange={(opt) => handleChange('fontColor', opt)}
						title='Цвет шрифта'
					/>
					<Separator />
					<Select
						options={backgroundColors}
						selected={draftState.backgroundColor}
						onChange={(opt) => handleChange('backgroundColor', opt)}
						title='Цвет фона'
					/>
					<Select
						options={contentWidthArr}
						selected={draftState.contentWidth}
						onChange={(opt) => handleChange('contentWidth', opt)}
						title='Ширина контента'
					/>
					<div className={styles.bottomContainer}>
						<Button title='Сбросить' htmlType='reset' type='clear' />
						<Button title='Применить' htmlType='submit' type='apply' />
					</div>
				</form>
			</aside>
		</>
	);
};
