
import React, { useState, useEffect } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { useSnapshot } from 'valtio';

import config from '../config/config';
import state from '../store';
import { download } from '../assets';
import { downloadCanvasToImage, reader } from '../config/helpers';
import { EditorTabs, FilterTabs, DecalTypes } from '../config/constants';
import { fadeAnimation, slideAnimation } from '../config/motion';
import { AIPicker, ColorPicker, CustomButton, FilePicker, Tab } from '../components';

const Customizer = () => {
	const snap = useSnapshot(state);

	//for file upload
	const [file, setFile] = useState('');

	//for ai file upload
	const [prompt, setPrompt] = useState('');
	const [generatingImg, setGeneratingImg] = useState(false);

	//to see which tab we are selecting
	const [activeEditorTab, setActiveEditorTab] = useState("");
	const [activeFilterTab, setActiveFilterTab] = useState({
	  logoShirt: true,
	  stylishShirt: false,
	})
  

	// show tab content depending activeTab
	const generateTabContent = () => {
		switch (activeEditorTab) {
			case "colorpicker":
					return <ColorPicker />
			break;
		
			case "filepicker":
				return <FilePicker
					file={file}
					setFile={setFile}
					readFile={readFile}
					/>
			break;

			case "aipicker":
				return <AIPicker
					prompt={prompt}
					setPrompt={setPrompt}
					generatingImg={generatingImg}
					handleSubmit={handleSubmit}
				/>
			break;	

			default:
				return null;
		} 
	}

	const handleSubmit = async (type) => {
		if(!prompt) alert ('Please Enter a Prompt')

		try {
			//call backend to make ai image
			
		} catch (error) {
			alert(error)
		} finally {
			setGeneratingImg(false)
			setActiveEditorTab(false)
		}
	}
	const handleActiveFilterTab = (tabName) => {
		switch (tabName) {
			case "logoShirt":
					state.isLogoTexture = !activeFilterTab[tabName]
				break;
			case "stylishShirt":
				state.isLogoTexture = !activeFilterTab[tabName]
			break;
			default:
				state.isLogoTexture = true;
				state.isFullTexture = false;
		}

		//after setting the state we have to update the active
		setActiveFilterTab((prevState) => {
			return {
				...prevState,
				[tabName]: !prevState[tabName]
			}
		})
	}
	const handleDecals = (type, result) => {
		const decalType = DecalTypes[type];

		state[decalType.stateProperty] = result; 

		if(!activeFilterTab[decalType.filterTab]) {
			handleActiveFilterTab(decalType.filterTab)
		}
	}

	const readFile = (type) => {
		reader(file)
			.then((result) => {
				handleDecals(type, result)
				setActiveEditorTab("")
			})
	}


  	return (
    	<AnimatePresence>
			{!snap.intro && (
				<>
					<motion.div
						key="custom"
						className='absolute top-0 left-0 z-10'
						{...slideAnimation('left')}
					>
						<div className='flex items-center min-h-screen'>
							<div className='editortabs-container tabs'>
								{EditorTabs.map((tab, index) =>(
									<Tab
										key={tab.name}
										tab={tab}
										handleClick={() => setActiveEditorTab(tab.name)}
									/>
								))}

								{generateTabContent(activeEditorTab)}
							</div>
						</div>
					</motion.div>
					<motion.div
						className='absolute z-10 top-5 right-5'
						{...fadeAnimation}
					>
						<CustomButton
							type="filled"
							title='Go Back'
							handleClick={() => state.intro = true}
							customStyles="w-fit px-4 py-2.5 font-bold text-sm"
						/>
					</motion.div>
					<motion.div className='filtertabs-container' {...slideAnimation('up')}>
						{FilterTabs.map((tab, index) =>(
							<Tab
								key={tab.name}
								tab={tab}
								isFilterTab
								isActiveTab={activeFilterTab[tab.name]}
								handleClick={() => handleActiveFilterTab(tab.name)}
							/> 
						))}
					</motion.div> 
				</>
			)} 
		</AnimatePresence>
  	)
}

export default Customizer