import {
	Controller,
	Post,
	UploadedFile,
	UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';

@Controller('plugin')
export class PluginController {
	@Post('upload')
	@UseInterceptors(
		FileInterceptor('file', {
			storage: diskStorage({
				destination: 'uploads',
				filename: (_, file, cb) => {
					const randomName = Array(16)
						.fill(null)
						.map(() => Math.round(Math.random() * 8).toString(8))
						.join('');
					return cb(null, `${randomName}-${file.originalname}`); // 保持原始扩展名
				},
			}),
		}),
	)
	uploadFile(@UploadedFile() file: Express.Multer.File) {
		return 'uploads/' + file.filename;
	}
}
