import { Pane } from 'tweakpane';
import { Object3D, Color, MeshBasicMaterial, TextureLoader, MeshPhysicalMaterial, MeshStandardMaterial, MeshPhongMaterial } from 'three';
import * as EssentialsPlugin from '@tweakpane/plugin-essentials';
import * as TweakpanePluginMedia from 'tweakpane-plugin-media';
import * as TweakpaneFileImportPlugin from '../../../node_modules/tweakpane-plugin-file-import/dist/tweakpane-plugin-file-import.js';
class TweakpaneManager {
  private pane: Pane;
  public textureLoader: TextureLoader
  constructor() {
    this.textureLoader = new TextureLoader();
    // this.pane = new Pane({
    //   title: 'pane'
    // });
    // this.pane.registerPlugin(EssentialsPlugin);
  }

  private createMaterialComponent(Material_Color: any, object: Object3D) {
    if (['MeshPhysicalMaterial', 'MeshStandardMaterial', 'MeshPhongMaterial'].includes(object?.material?.type)) {
      if (object?.material?.type === 'MeshPhongMaterial') {
        Material_Color.addBinding(object.mesh.material, 'specular', {
          picker: 'inline',
          expanded: true,
        }).on('change', (e) => {
          console.log('e', e.value)
          const { r, g, b } = e.value
          const color = `rgb(${parseInt(r)},${parseInt(g)},${parseInt(b)})`
          console.log(color)

          object.mesh.material.specular = new Color(color)
        })
      }
      Material_Color.addBinding(object.mesh.material, 'emissive', {
        picker: 'inline',
        expanded: true,
      }).on('change', (e) => {
        console.log('e', e.value)
        const { r, g, b } = e.value
        const color = `rgb(${parseInt(r)},${parseInt(g)},${parseInt(b)})`
        console.log(color)


        object.mesh.material.emissive = new Color(color)
      })
    }
  }
  public createPane(object: Object3D) {

    if (this.pane?.dispose) {
      this.pane.dispose()
    }
    this.pane = new Pane({
      title: object.name,
      container: document!.getElementById('rightCurrentPane') as any
    })
  }
  public addInput(object: Object3D) {
    this.createPane(object)
    this.pane.registerPlugin(EssentialsPlugin);
    this.pane.registerPlugin(TweakpanePluginMedia);
    this.pane.registerPlugin(TweakpaneFileImportPlugin);

    console.log(object, 'object')
    const Tranforms = this.pane.addFolder({ title: 'Tranforms' });

    const Common = this.pane.addFolder({ title: 'Common' });
    Common.addBinding(object, 'name');

    // object.mesh.material.color = new Color('red')

    Tranforms.addBinding(object, 'position');
    Tranforms.addBinding(object, 'rotation');
    Tranforms.addBinding(object, 'scale');

    const Lyaers = this.pane.addFolder({ title: 'Lyaers' });
    Lyaers.addBlade({
      view: 'buttongrid',
      size: [8, 4],
      cells: (x, y) => ({
        title: [
          ['1', '2', '3', '4', '5', '6', '7', '8'],
          ['9', '10', '11', '12', '13', '14', '15', '16'],
          ['17', '18', '19', '20', '21', '22', '23', '24'],
          ['25', '26', '27', '28', '29', '30', '31', '32'],
        ][y][x],
      }),
      label: 'lyaers',
    }).on('click', (ev) => {
      console.log(ev);
    });
    // Lyaers.addBinding(object, 'layers');
    //材质
    const Material = this.pane.addFolder({ title: 'Material' });
    Material.addBlade({
      view: 'list',
      options: [
        { text: 'MeshBasicMaterial', value: 'MeshBasicMaterial' },
        { text: 'MeshPhysicalMaterial', value: 'MeshPhysicalMaterial' },
        { text: 'MeshStandardMaterial', value: 'MeshStandardMaterial' },
        { text: 'MeshPhongMaterial', value: 'MeshPhongMaterial' },
      ],
      value: object.mesh.material.type,
    }).on('change', (e) => {
      console.log(e, 'e.value;')
      const materialType = e.value;
      let newMaterial;
      switch (materialType) {
        case 'MeshBasicMaterial':
          newMaterial = new MeshBasicMaterial();
          break;
        case 'MeshPhysicalMaterial':
          newMaterial = new MeshPhysicalMaterial();
          break;
        case 'MeshStandardMaterial':
          newMaterial = new MeshStandardMaterial();
          break;
        case 'MeshPhongMaterial':
          newMaterial = new MeshPhongMaterial();
          break;
        default:
          console.error('Unknown material type:', materialType);
          return;
      }

      object.mesh.material = newMaterial;

      console.log(object.mesh.material, 'object.mesh.material')

      this.addInput(object)

    })

    //材质颜色
    const Material_Color = this.pane.addFolder({ title: 'Material / Color' + ' ' + object?.material?.type });
    Material_Color.addBinding(object.mesh.material, 'color', {
      picker: 'inline',
      expanded: true,
    }).on('change', (e) => {
      console.log('e', e.value)
      const { r, g, b } = e.value
      const color = `rgb(${parseInt(r)},${parseInt(g)},${parseInt(b)})`
      console.log(color)

      object.mesh.material.color = new Color(color)
    })
    if (['MeshPhysicalMaterial', 'MeshStandardMaterial', 'MeshPhongMaterial'].includes(object?.mesh.material?.type)) {

      if (object?.mesh.material?.type === 'MeshPhongMaterial') {
        Material_Color.addBinding(object.mesh.material, 'specular', {
          picker: 'inline',
          expanded: true,
        }).on('change', (e) => {
          console.log('e', e.value)
          const { r, g, b } = e.value
          const color = `rgb(${parseInt(r)},${parseInt(g)},${parseInt(b)})`
          console.log(color)

          object.mesh.material.specular = new Color(color)
        })
      }
      Material_Color.addBinding(object.mesh.material, 'emissive', {
        picker: 'inline',
        expanded: true,
      }).on('change', (e) => {
        console.log('e', e.value)
        const { r, g, b } = e.value
        const color = `rgb(${parseInt(r)},${parseInt(g)},${parseInt(b)})`
        console.log(color)

        object.mesh.material.emissive = new Color(color)
      })
    }
    // this.createMaterialComponent(Material_Color, object)

    const Material_Textures = this.pane.addFolder({ title: 'Material / Material_Textures' });

    const texture = object.mesh.material.map; // 获取材质的贴图

    Material_Textures.addBinding({
      image: texture?.image ?? new Image()  // 使用材质的贴图
    }, 'image', {
      label: 'Map',
      view: 'image',
      height: 80, // Preview block height in px - Optional (Default to 100)
      objectFit: 'contain', // Preview block object fit - Optional (Default to cover)
      showMonitor: true, // Whether or not to show the file name monitor - Optional (Default to false),
    }).on('change', (ev) => {
      console.log(ev.value.src);
      const images = this.textureLoader.load('/src/assets/' + ev.value.id)
      console.log(images, 'images')
      images.needsUpdate = true; // 标记贴图需要更新
      object.mesh.material.map = images
      object.material.map = images
      // images.needsUpdate = true; // 标记贴图需要更新
      console.log(object, 'objectobject')
      object.mesh.material = new MeshBasicMaterial({
        map: images,
        ...object.mesh.material
      })
      // const newImage = ev.value; // 获取新的图像
      // texture.image = newImage; // 更新贴图的图像
      // texture.needsUpdate = true; // 标记贴图需要更新
    });
    const Script = this.pane.addFolder({ title: 'Script' });
    const params = {
      file: '',
    };
    Script.addBinding(params, 'file', {
      view: 'file-input',
      lineCount: 3,
      // filetypes: ['.png', '.jpg'],
      // invalidFiletypeMessage: "We can't accept those filetypes!"
    })
      .on('change', (ev) => {
        console.log(ev.value);
      });

    const Model = this.pane.addFolder({ title: 'Model' });

  }
}

export default TweakpaneManager;