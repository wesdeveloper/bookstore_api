import app from '../src/app';
import logger from '../src/config/logger';

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => logger.info(`Server listening on port: ${PORT}`));
