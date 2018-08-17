import VisCoreChild from '@ember-vis/core/components/vis-core-child/component';
import Component from '@ember/component';

export default class VisCoreContainer extends Component {
	children: VisCoreChild[] = [];

	constructor(properties?: object) {
		super(properties);
	}

	addChild(child: VisCoreChild) {
		this.children.pushObject(child);
		this.registerChild(child);
	}

	removeChild(child: VisCoreChild) {
		this.children.removeObject(child);
		this.unregisterChild(child);
	}

	registerChild(child: VisCoreChild) {}
	unregisterChild(child: VisCoreChild) {}

}

